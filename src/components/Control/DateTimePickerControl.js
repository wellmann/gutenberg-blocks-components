// WordPress dependencies.
const { useContext } = wp.element;
const { dateI18n, __experimentalGetSettings } = wp.date;
const { PanelRow, Dropdown, BaseControl, Button, DateTimePicker, DatePicker, TimePicker } = wp.components;
const { withInstanceId } = wp.compose;

const DateTimePickerControl = ({ label, time = true, date = true, value, ...props }) => {
  const id = 'inspector-date-time-picker-control-' + props.instanceId;
  const settings = __experimentalGetSettings();
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
    <BaseControl>
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
    </BaseControl>
  );
};

export default withInstanceId(DateTimePickerControl);