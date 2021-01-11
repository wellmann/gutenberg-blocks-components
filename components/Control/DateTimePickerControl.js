// WordPress dependencies.
const { useContext } = wp.element;
const { dateI18n, __experimentalGetSettings } = wp.date;
const { PanelRow, Dropdown, Button, DateTimePicker, DatePicker, TimePicker } = wp.components;
const { withInstanceId } = wp.compose;

// Local dependencies.
import { EditContext } from 'components';

const DateTimePickerControl = ({ name, label, time = true, date = true, ...props }) => {
  const id = 'inspector-date-time-picker-control-' + props.instanceId;
  const { attributes } = useContext(EditContext);
  const settings = __experimentalGetSettings();
  const value = attributes[name];
  let Picker = DateTimePicker;
  let format = `${settings.formats.date} ${settings.formats.time}`;

  if (date && !time) {
    Picker = DatePicker;
    format = settings.formats.date;
  }

  if (time && !date) {
    Picker = TimePicker;
    format = settings.formats.time;
  }

  return (
    <PanelRow className="edit-post-post-schedule">
      <label htmlFor={ id } className="components-base-control__label">{ label }</label>
      <Dropdown
        position="bottom left"
        contentClassName="edit-post-post-schedule__dialog"
        renderToggle={ ( { onToggle, isOpen } ) => (
          <>
            <Button
              id={ id }
              className="edit-post-post-schedule__toggle"
              onClick={ onToggle }
              aria-expanded={ isOpen }
              isLink
            >
              { dateI18n(format, value || new Date())}
            </Button>
          </>
        ) }
        renderContent={ () => <Picker
          currentDate={ value || new Date() }
          { ...props }
        /> }
      />
    </PanelRow>
  );
};

export default withInstanceId(DateTimePickerControl);