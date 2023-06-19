import styled from 'styled-components'
import { Button, Form, Input, Modal } from 'antd'
import { useContext } from 'react'
import { UserContext } from '../../context/AppContext'
import { FUNC } from '../../context/enum'
import API from '../../context/config'
import { useState } from 'react'
import toastr from 'toastr'

const HeaderStyled = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  background: #2424f8;
  display: flex;
  justify-content: space-between;
  z-index: 10000;

  .func-area {
    display: flex;

    .func {
      color: #dddada;
      padding: 8px 16px;
      font-size: 18px;
    }
    
    .func:not(.active):hover {
      cursor: pointer;
      color: white;
      background: #3939fd;
    }

    .func.active {
      background: #7676fc;
      color: white;
    }
  }
  
  .user-area {
    line-height: 36px;
    color: white;
  }
`
const ChangePassForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

export default function Header(props) {
  const { curFunc, setCurFunc, funcs } = props
  const { user, setUser } = useContext(UserContext)

  const logout = () => {
    API.get('/users/logout').then(res => {
      setUser(null)
    }).catch(e => {
      setUser(null)
    })
  }

  const [changePassModal, setChangePassModal] = useState(false)
  const [form] = Form.useForm()
  const handleChangePass = (values) => {
    API.post('/users/changePass', values).then(res => {
      if (res.data.value) {
        toastr.success(res.data.message)
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error('Có lỗi trong quá trình xử lý')
    }).finally(() => {
      setChangePassModal(false)
    })
  }
  return (
    <HeaderStyled>
      <div className="func-area">
        {funcs.filter(func => func.key >= FUNC.ALL_COURSES && func.isShow()).map(func => (
          <div 
            key={func.key}
            className={`func ${curFunc === func.key && "active"}`}
            onClick={() => setCurFunc(func.key)}
          >{func.name}</div>
        ))}
      </div>
      <div className="user-area">
        {user && <span>{user.username}</span>}
        {!user && <>
          <Button type='primary' onClick={() => setCurFunc(FUNC.LOGIN)}>
            Đăng nhập
          </Button>
          <Button type='primary' onClick={() => setCurFunc(FUNC.REGISTER)}>
            Đăng ký
          </Button>
        </>}
        {user && <>
          <Button type='primary' onClick={() => setChangePassModal(true)}>
            Đổi mật khẩu
          </Button>
          <Button type='primary' onClick={logout}>
            Đăng xuất
          </Button>
        </>}
      </div>

      <Modal
        title="Đổi mật khẩu"
        open={changePassModal}
        onCancel={() => setChangePassModal(false)}
        onOk={form.submit}
      >
        <ChangePassForm 
          form={form} 
          onFinish={(values) => handleChangePass(values)}
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Nhập lại mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Mật khẩu không khớp!');
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </ChangePassForm>
      </Modal>
    </HeaderStyled>
  )
}
