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

import {Store} from 'n3';
import {
    allCharacteristicsFactory,
    allConstraintsFactory,
    aspectFactory,
    entityFactory,
    eventFactory,
    getEvents,
    operationFactory,
    predefinedEntitiesFactory,
    propertyFactory,
    unitFactory,
} from './instantiator';
import {valueFactory} from './instantiator/value-instantiator';
import {BaseInitProps} from './shared/base-init-props';
import {ModelElementCache} from './shared/model-element-cache.service';
import {RdfModel} from './shared/rdf-model';

export function useLoader(init?: Partial<BaseInitProps>) {
    const rdfModel = init?.rdfModel || new RdfModel(new Store());
    const cache = init?.cache || new ModelElementCache();
    const baseInit: BaseInitProps = {rdfModel, cache};

    return {
        createAspect: aspectFactory(baseInit),
        createEntity: entityFactory(baseInit),
        createValue: valueFactory(baseInit),
        createEvent: eventFactory(baseInit),
        createEvents: getEvents(baseInit),
        createOperation: operationFactory(baseInit),
        ...propertyFactory(baseInit),
        ...unitFactory(baseInit),
        ...predefinedEntitiesFactory(baseInit),
        ...allConstraintsFactory(baseInit),
        ...allCharacteristicsFactory(baseInit),
    };
}
