import React, { useState } from 'react';
import { Button, Input } from 'antd';
import styled from 'styled-components';

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ItemInput = styled(Input)`
  width: 200px;
  margin-right: 8px;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

const Item = ({ item, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [itemName, setItemName] = useState(item.name);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = () => {
    onUpdate(item.id, itemName);
    setEditing(false);
  };

  const handleCancel = () => {
    setItemName(item.name);
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  return (
    <ItemWrapper>
      {editing ? (
        <ItemInput
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      ) : (
        <span>{item.name}</span>
      )}
      <ItemActions>
        {editing ? (
          <>
            <Button type="primary" onClick={handleUpdate}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </>
        ) : (
          <>
            <Button onClick={handleEdit}>Edit</Button>
            <Button danger onClick={handleDelete}>Delete</Button>
          </>
        )}
      </ItemActions>
    </ItemWrapper>
  );
};

export default Item