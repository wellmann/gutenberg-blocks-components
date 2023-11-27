// WordPress dependencies.
const { BaseControl, Button, Card, CardBody } = wp.components;
const { withInstanceId } = wp.compose;
const { useContext } = wp.element;
const { withSelect } = wp.data;
const { __ } = wp.i18n;
import { Icon, dragHandle } from '@wordpress/icons';

// External dependencies.
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableListControl = ({ label, options, value, onChange, resetLabel = __('Reset'), size = 'small', children, instanceId, ...restProps }) => {
  const id = 'sortable-list-control-' + instanceId;
  const items = value.length && value.length > 0 ? value : options;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.value === active.id);
      const newIndex = items.findIndex((item) => item.value === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);

      onChange(newItems);
    }
  }

  return (
    <BaseControl>
      <DndContext
        sensors={ sensors }
        collisionDetection={ closestCenter }
        onDragEnd={ handleDragEnd }
      >
        <SortableContext
          items={ items.map((item) => item.value) }
          strategy={ verticalListSortingStrategy }
        >
          <BaseControl.VisualLabel><span id={ id }>{ label }</span></BaseControl.VisualLabel>
          <ul style={ { margin: 0 } } aria-labelledby={ id }>{ items.map((item) => <SortableItem key={ id + '-' + item.value } { ...{ item, size, children } } />) }</ul>
        </SortableContext>
      </DndContext>
      { resetLabel && <Button onClick={ () => onChange([]) } style={ { marginTop: '1em' } } isLink isDestructive>{ resetLabel }</Button> }
    </BaseControl>
  );
};

const SortableItem = ({ item, size, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: item.value,
    disabled: !!item.disabled
  });

  let cardBodyStyle = {};
  if (size === 'small') {
    cardBodyStyle = { padding: '6px 9px' };
  }

  return (
    <li
      ref={ setNodeRef }
      style={ {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
        margin: 0
      } }
      { ...attributes }
      { ...listeners }
    >
      { typeof children === 'function' ? children(item) :
        <Card>
          <CardBody style={ cardBodyStyle }>
            <Icon
              icon={ dragHandle }
              size={ size === 'small' ? 16 : 24 }
              style={ { verticalAlign: 'middle', marginRight: '1em' } }
            />
            { item.label }
          </CardBody>
        </Card>
      }
    </li>
  );
}

export default withInstanceId(SortableListControl);