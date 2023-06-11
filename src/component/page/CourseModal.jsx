import { Empty, Modal, Tabs } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import Tests from './Tests'
import Videos from './Videos'
import Video from './Video'
import Test from './Test'

const ModalStyled = styled(Modal)`
  .modal-content {
    width: 100%;
    height: 100%;
    display: flex;
  
    .left-modal {
      width: 20%;
      height: 100%;

      .course-image {
        width: 100%;
        height: 120px;
      }

      .course-tab {
        width: 100%;
        height: 338px;
        border-radius: 4px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        padding: 4px 8px;
      }
    }
  
    .right-modal {
      flex-grow: 1;
      height: 100%;
      padding-left: 16px;

      .right-modal-main {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 4px;
        width: 100%;
        height: 100%;
      }
    }
  }
`

export default function CourseModal(props) {
  const { courseId, setCourseId, setShowAuth } = props
  const [selected, setSelected] = useState(null);

  const courseInfo = {
    title: "Khóa học " + courseId,
    description: "Mô tả khóa học " + courseId,
    image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
  }

  const handleCancel = () => {
    setSelected(null)
    setCourseId(null)
  }

  return (
    <ModalStyled 
      title={courseInfo.title} 
      maskClosable={false} 
      width={1200} 
      style={{top: 20}} 
      bodyStyle={{height: 520}} 
      footer={null} 
      open={!!courseId} 
      onCancel={handleCancel}
    >
      <div className="modal-content">
        <div className="left-modal">
          <div className="course-image" style={{background: `url(${courseInfo.image})`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}></div>
          <Tabs
            defaultActiveKey="1"
            centered
            onChange={() => setSelected(null)}
            items={[
              {
                label: `Bài giảng`,
                key: "1",
                children: <div className='course-tab'><Videos selected={selected} setShowAuth={setShowAuth} select={setSelected} courseId={courseId} /></div>,
              },
              {
                label: `Kiểm tra`,
                key: "2",
                children: <div className='course-tab'><Tests selected={selected} setShowAuth={setShowAuth} select={setSelected} courseId={courseId} /></div>,
              }
            ]}
          />
        </div>
        <div className="right-modal">
          <div className="right-modal-main">
            {selected !== null && selected[0] === 'v' && <Video videoId={selected} />}
            {selected !== null && selected[0] === 't' && <Test testId={selected} />}
            {selected === null && <Empty description="Hãy chọn một bài kiểm tra hoặc một bài giảng" />}
          </div>
        </div>
      </div>
    </ModalStyled>
  )
}
