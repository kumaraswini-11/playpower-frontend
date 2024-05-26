import { useCallback } from "react";

const useDragAndDrop = (items, setItems) => {
  const handleDragStart = useCallback((e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e, index) => {
      e.preventDefault();
      const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"));
      if (draggedIndex === index) return;

      const updatedItems = [...items];
      const [draggedItem] = updatedItems.splice(draggedIndex, 1);
      updatedItems.splice(index, 0, draggedItem);

      setItems(updatedItems);
    },
    [items, setItems]
  );

  return { handleDragStart, handleDragEnter, handleDragOver, handleDrop };
};

export default useDragAndDrop;
