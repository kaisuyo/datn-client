import React, { useState } from 'react';
import { Button, Col, List, Row, Space, Typography } from 'antd';
import styled from 'styled-components';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import API from '../../../../context/config';
import toastr from 'toastr'
import ListSuggest from './ListSuggest';

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px;
  height: 400px;
`;

const StyledList = styled(List)`
  width: 200px;
  height: 380px;
  overflow: scroll;
`;

const SuggestCourses = (props) => {
  const { user } = props
  const [customList, setCustomList] = useState([]);
  const [userList, setUserList] = useState([])
  const [subjectList, setSubjectList] = useState([])
  const [allList, setAllList] = useState([]);

  const moveItemToLeft = (item) => {
    setAllList(allList.filter((i) => i.key !== item.key));
    setCustomList([...customList, item]);
  };

  const moveItemToRight = (item) => {
    setCustomList(customList.filter((i) => i.key !== item.key));
    setAllList([...allList, item]);
  };

  useEffect(() => {
    API.post('/suggest/get/', {userId: user.userId}).then(res => {
      if (res.data.value) {
        const { all, userSuggest, subjectSuggest, customSuggest } = res.data.value
        setAllList(all)
        setCustomList(customSuggest)
        setUserList(userSuggest)
        setSubjectList(subjectSuggest)
      }
    })
  }, [user])

  const addCustomSuggest = (course) => {
    API.post('/suggest/assign', {userId: user.userId, courseId: course.key}).then(res => {
      if (res.data.value) {
        moveItemToLeft(course)
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  const removeCustomSuggest = (course) => {
    API.post('/suggest/unAssign', {userId: user.userId, courseId: course.key}).then(res => {
      if (res.data.value) {
        moveItemToRight(course)
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  return (
    <StyledContainer>
      <Row>
        <Space size='large'>
          <Col>
            <Typography.Title level={5}>Theo môn học</Typography.Title>
            <ListSuggest dataSource={subjectList}/>
          </Col>
          <Col>
            <Typography.Title level={5}>Người dùng tương tự</Typography.Title>
            <ListSuggest dataSource={userList} />
          </Col>
          <Col>
            <Typography.Title level={5}>Gợi ý thủ công</Typography.Title>
            <ListSuggest dataSource={customList} danger handleItem={(item) => removeCustomSuggest(item)}>
              <CloseOutlined />
            </ListSuggest>
          </Col>
          <Col>
            <Typography.Title level={5}>Tất cả khóa học</Typography.Title>
            <ListSuggest dataSource={allList} handleItem={item => addCustomSuggest(item)}>
              <PlusOutlined />
            </ListSuggest>
          </Col>
        </Space>
      </Row>
    </StyledContainer>
  );
};

export default SuggestCourses;
