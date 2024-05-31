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

import {Type} from '../type';
import {DefaultEnumeration, Enumeration} from './default-enumeration';
import {DefaultEntityInstance} from '../default-entity-instance';

export interface State extends Enumeration {
    defaultValue: DefaultEntityInstance | string | number;
}

export class DefaultState extends DefaultEnumeration implements State {
    constructor(
        metaModelVersion: string,
        aspectModelUrn: string,
        name: string,
        values: Array<DefaultEntityInstance | string | number>,
        private _defaultValue: DefaultEntityInstance | string | number,
        dataType?: Type
    ) {
        super(metaModelVersion, aspectModelUrn, name, values, dataType);
    }

    public set defaultValue(value: DefaultEntityInstance | string | number) {
        this._defaultValue = value;
    }

    public get defaultValue(): DefaultEntityInstance | string | number {
        return this._defaultValue;
    }
}
