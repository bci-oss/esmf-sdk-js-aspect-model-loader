/*
 * Copyright (c) 2023 Robert Bosch Manufacturing Solutions GmbH
 *
 * See the AUTHORS file(s) distributed with this work for
 * additional information regarding authorship.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * SPDX-License-Identifier: MPL-2.0
 */
import {CharacteristicInstantiator} from './characteristic-instantiator';
import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {NamedNode, Quad, Util} from 'n3';
import {Characteristic} from '../../aspect-meta-model';
import {DefaultEnumeration, Enumeration} from '../../aspect-meta-model/characteristic/default-enumeration';
import {Samm} from '../../vocabulary';
import {EntityInstantiator} from '../entity-instantiator';
import {DefaultEntityInstance} from '../../aspect-meta-model/default-entity-instance';
import {CharacteristicInstantiatorUtil, MultiLanguageText} from './characteristic-instantiator-util';

export class EnumerationCharacteristicInstantiator extends CharacteristicInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: CharacteristicInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        const samm = this.metaModelElementInstantiator.samm;
        const sammC = this.metaModelElementInstantiator.sammC;
        const enumeration = this.creatEnumerationObject();
        const dataType = quads.find(quad => this.samm.isDataTypeProperty(quad.predicate.value));

        quads.forEach(quad => {
            if (samm.isValueProperty(quad.predicate.value) || sammC.isValuesProperty(quad.predicate.value)) {
                if (Util.isBlankNode(quad.object)) {
                    enumeration.values = this.getEnumerationValues(quad, dataType?.object.value);
                }
            }
        });
        return enumeration;
    }

    /**
     * Override the method in the corresponding specific enumeration class to create the correct type of
     * collection e.g. see state-characteristic-instantiator.
     */
    protected creatEnumerationObject(): Enumeration {
        return new DefaultEnumeration(null, null, null, null, null);
    }

    private getEnumerationValues(quad: Quad, dataType: string): Array<string | number | DefaultEntityInstance> {
        const quads = this.metaModelElementInstantiator.rdfModel.resolveBlankNodes(quad.object.value);
        return quads.map(quadValue =>
            Util.isLiteral(quadValue.object) ? CharacteristicInstantiatorUtil.resolveValues(quadValue, dataType) : this.resolveEntityInstance(quadValue)
        );
    }

    protected resolveEntityInstance(quad: Quad): DefaultEntityInstance {
        const entityInstanceQuads = this.metaModelElementInstantiator.rdfModel.store.getQuads(quad.object, null, null, null);
        const entityTypeQuad = entityInstanceQuads.find(
            entityInstanceQuad => entityInstanceQuad.predicate.value === `${Samm.RDF_URI}#type`
        );

        if (entityTypeQuad) {
            const entity = new EntityInstantiator(this.metaModelElementInstantiator).createEntity(
                this.metaModelElementInstantiator.rdfModel.store.getQuads(entityTypeQuad.object, null, null, null)
            );

            // determine the description of the value/instance if defined
            const descriptionQuad = entityInstanceQuads.find(
                quad =>
                    quad.predicate.id.toLowerCase().includes('description') &&
                    entity.properties.find(property => property.isNotInPayload === false && quad.predicate.id)
            );
            const descriptions = new Map<string, string>();
            if (descriptionQuad) {
                entityInstanceQuads
                    .filter(quad => quad.predicate.id === descriptionQuad.predicate.id)
                    .forEach(quad =>
                        descriptions.set(this.metaModelElementInstantiator.rdfModel.getLocale(quad) || 'en', quad.object.value)
                    );
            }

            // create the related instance and attach the metamodel element to it
            const entityInstance = new DefaultEntityInstance(quad.object.value.split('#')[1], entity, descriptions);
            entityInstanceQuads.forEach(quad => {
                const predicateKey = CharacteristicInstantiatorUtil.getPredicateKey(quad);
                entityInstance[predicateKey] = this.resolveQuadObject(quad);
            });

            return entityInstance;
        }
        throw new Error(`Could resolve Entity instance ${entityTypeQuad.subject.value}`);
    }

    private resolveQuadObject(quad: Quad): MultiLanguageText | Array<MultiLanguageText> | string {
        if (Util.isBlankNode(quad.object)) {
            const resolvedBlankNodes = this.metaModelElementInstantiator.rdfModel.resolveBlankNodes(quad.object.value);
            return CharacteristicInstantiatorUtil.solveBlankNodeValues([...resolvedBlankNodes]);
        }

        if (((quad.object as any).datatypeString === Samm.RDF_LANG_STRING) ||
            ((quad.object as any).datatypeString === Samm.XML_LANG_STRING)) {
            return CharacteristicInstantiatorUtil.createLanguageObject(quad);
        }

        return quad.object.value;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.EnumerationCharacteristic().equals(nameNode);
    }
}
