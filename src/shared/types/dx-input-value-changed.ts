import { CalendarTypes } from 'devextreme-react/cjs/calendar'
import { CheckBoxTypes } from 'devextreme-react/cjs/check-box'
import { ColorBoxTypes } from 'devextreme-react/cjs/color-box'
import { DateBoxTypes } from 'devextreme-react/cjs/date-box'
import { DateRangeBoxTypes } from 'devextreme-react/cjs/date-range-box'
import { DropDownBoxTypes } from 'devextreme-react/cjs/drop-down-box'
import { NumberBoxTypes } from 'devextreme-react/cjs/number-box'
import { SelectBoxTypes } from 'devextreme-react/cjs/select-box'
import { SwitchTypes } from 'devextreme-react/cjs/switch'
import { TagBoxTypes } from 'devextreme-react/cjs/tag-box'
import { TextAreaTypes } from 'devextreme-react/cjs/text-area'
import { TextBoxTypes } from 'devextreme-react/cjs/text-box'

export type DxInputValueChangedEvent =
    | TextBoxTypes.ValueChangedEvent
    | NumberBoxTypes.ValueChangedEvent
    | CalendarTypes.ValueChangedEvent
    | CheckBoxTypes.ValueChangedEvent
    | ColorBoxTypes.ValueChangedEvent
    | DateBoxTypes.ValueChangedEvent
    | DateRangeBoxTypes.ValueChangedEvent
    | DropDownBoxTypes.ValueChangedEvent
    | SelectBoxTypes.ValueChangedEvent
    | SwitchTypes.ValueChangedEvent
    | TagBoxTypes.ValueChangedEvent
    | TextAreaTypes.ValueChangedEvent
