import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [users, setUsers] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [selectedId, setSelectedId] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(`http://localhost:4000/api/users`, {
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName
    },{
      headers:{
        "Content-Type": 'application/json',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS",
        Authorization: `Bearer ${process.env.REACT_APP_JWT_TOKEN}`
      }
    }).then((res) => {
      toast.success(`User ${email} has been saved`);
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      fetchUsers();
    }).catch((e) => {
      toast.error("Error saving user :( User might already existed");
      console.log(e);
    })
  }

  const fetchUsers = async () =>  {
    axios.get(`http://localhost:4000/api/users`, {
      headers:{
        "Content-Type": 'application/json',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS",
        Authorization: `Bearer ${process.env.REACT_APP_JWT_TOKEN}`
      }
    }).then((res) => {
      console.log(res);
      if(res.data){
        setUsers(res.data.data);
      }

    }).catch((e) => {
      toast.error("Error saving user :( User might already existed");
      console.log(e);
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    axios.put(`http://localhost:4000/api/users/${selectedId}`, {
      first_name: editFirstName,
      last_name: editLastName
    },{
      headers:{
        "Content-Type": 'application/json',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS",
        Authorization: `Bearer ${process.env.REACT_APP_JWT_TOKEN}`
      }
    }).then((res) => {
      toast.success(`User ${selectedId} has been updated`);
      setEditFirstName('');
      setEditLastName('');
      closeModal();
      fetchUsers();
    }).catch((e) => {
      toast.error("Error saving user :( User might already existed");
      console.log(e);
    })
  }

  const handleDelete = async () => {
    axios.delete(`http://localhost:4000/api/users/${selectedId}`, {
      headers:{
        "Content-Type": 'application/json',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS",
        Authorization: `Bearer ${process.env.REACT_APP_JWT_TOKEN}`
      }
    }).then((res) => {
      closeModal2();

      if(res.data){
        setUsers(res.data.data);
      }
      toast.success(`User ${selectedId} has been deleted`);
      fetchUsers();
    }).catch((e) => {
      toast.error("Error deleting user :( User might already existed");
      console.log(e);
    })
  }

  const openModal = () => {
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  const openModal2 = () => {
    setModalOpen2(true);
  }

  const closeModal2 = () => {
    setModalOpen2(false);
  }


  useEffect(() => {
    fetchUsers();
  }, [])

  useEffect(() => {
  }, [users])

  return (
    <div className="App">
      <header className="App-header">
      </header>
      {/* Add User */}
      <div className="p-4 text-white">
        <h1 className="font-bold text-3xl pb-3">ADD USER:</h1>
        <form className="flex flex-col" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-2 px-[20%]">
            Email:
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" required className="rounded-lg p-2 h-10 text-black"/>
            Password:
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" required className="rounded-lg p-2 h-10 text-black"/>
            First Name:
            <input onChange={(e) => setFirstName(e.target.value)} value={firstName} className="rounded-lg p-2 h-10 text-black"/>
            Last Name:
            <input onChange={(e) => setLastName(e.target.value)} value={lastName} className="rounded-lg p-2 h-10 text-black"/>
            <button type="submit" className="rounded-lg bg-[#395af0] px-3 py-2 max-w-20">
              SUBMIT
            </button>
          </div>
        </form>
      </div>
      {/* List Users */}
      <div className='p-4'>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Last Name</th>
                <th className="px-4 py-2 text-left">First Name</th>
                <th className="px-4 py-2 text-left">Edit</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 && users.map((user) => {
              return(<tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user._id}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.last_name}</td>
                <td className="px-4 py-2">{user.first_name}</td>
                <td className="px-4 py-2 flex gap-4">
                  <p onClick={() => {setModalOpen(true); setSelectedId(user._id); setEditFirstName(user.first_name); setEditLastName(user.last_name)}} className='text-blue-500 cursor-pointer hover:underline'>Edit</p>
                  <p onClick={() => {setModalOpen2(true); setSelectedId(user._id)}} className='text-blue-500 cursor-pointer hover:underline'>Delete</p>
                </td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={modalStyle}
        contentLabel="Edit User Modal"
      >
        <h1 className="font-bold text-3xl pb-3">Edit User:</h1>
        <form className="flex flex-col" onSubmit={(e) => handleEditSubmit(e)}>
          <div className="flex flex-col gap-2">
            First Name:
            <input onChange={(e) => setEditFirstName(e.target.value)} value={editFirstName} className="rounded-lg p-2 h-10 text-black"/>
            Last Name:
            <input onChange={(e) => setEditLastName(e.target.value)} value={editLastName} className="rounded-lg p-2 h-10 text-black"/>
            <button type="submit" className="rounded-lg bg-[#395af0] px-3 py-2 max-w-20">
              SUBMIT
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={modalOpen2}
        onRequestClose={closeModal2}
        style={modalStyle}
        contentLabel="Edit User Modal"
      >
        <h1 className="font-bold text-3xl pb-3">Delete User:</h1>
        <p>Are you sure?</p>
        <div className='flex gap-3 pt-5'>
          <button onClick={(e) => {handleDelete()}} type="submit" className="rounded-lg bg-[#395af0] px-3 py-2 max-w-20">
            Yes
          </button>
          <button onClick={(e) => {closeModal2()}} className="rounded-lg bg-[#f03939] px-3 py-2 max-w-20">
            No
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App
