// WordPress dependencies.
const { BaseControl, Card, CardBody } = wp.components;
const { useContext } = wp.element;
const { withSelect } = wp.data;
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

const SortableListControl = ({ label, options, value, onChange, size = 'small', children, ...restProps }) => {
  const items = value.length > 0 ? value : options;
  const sensors = useSensors(
    useSensor(PointerSensor),
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
    <BaseControl label={ label }>
      <DndContext
        sensors={ sensors }
        collisionDetection={ closestCenter }
        onDragEnd={ handleDragEnd }
      >
        <SortableContext
          items={ items.map((item) => item.value) }
          strategy={ verticalListSortingStrategy }
        >
          { items.map((item) => <SortableItem key={ item.value } { ...{ item, size, children } } />) }
        </SortableContext>
      </DndContext>
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
  } = useSortable({ id: item.value });

  let cardBodyStyle = {};
  if (size === 'small') {
    cardBodyStyle = { padding: '6px 9px' };
  }

  return (
    <div
      ref={ setNodeRef }
      style={ {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab'
      } }
      { ...attributes }
      { ...listeners }
    >
      { children ||
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
    </div>
  );
}

export default SortableListControl;