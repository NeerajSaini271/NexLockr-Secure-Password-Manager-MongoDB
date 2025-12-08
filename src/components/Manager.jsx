import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import viewIcon from '../assets/view.png';
import hideIcon from '../assets/hide.png';

const Manager = () => {
  const ref = useRef();
  const [form, setform] = useState({ site: "", Username: "", Password: "" });
  const [passwordArray, setpasswordArray] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  let getPasswords = async () => {
    // let req = await fetch("http://localhost:3000");
    let req = await fetch("https://passop-password-manager-mongodb.onrender.com");    
    let passwords = await req.json();
    console.log(passwords);
    setpasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    toast(" Copied to clipboard", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

    navigator.clipboard.writeText(text);
  };

  const showPassword = (id) => {
    setVisiblePasswords({
      ...visiblePasswords,
      [id]: !visiblePasswords[id],
    });
  };

  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.Username.length > 3 &&
      form.Password.length
    ) {
      const passwordId = form.id || uuidv4(); // Use existing ID or generate new one

      //If any such id exists in the database,delete it
      await fetch("https://passop-password-manager-mongodb.onrender.com", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: passwordId }),
      });

      const newPassword = { ...form, id: passwordId };

      setpasswordArray([...passwordArray, newPassword]);
      await fetch("https://passop-password-manager-mongodb.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPassword),
      });
      // localStorage.setItem(
      //   "passwords",
      //   JSON.stringify([...passwordArray, { ...form, id: uuidv4() }])
      // );
      setform({ site: "", Username: "", Password: "" });
      toast("Password saved", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      toast("Error: Password not saved", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const deletePassword = async (id) => {
    console.log("Delete Password with id:", id);
    let c = confirm("Do you really wanna delete this password?");
    if (c) {
      setpasswordArray(passwordArray.filter((item) => item.id !== id));
      let res = await fetch("https://passop-password-manager-mongodb.onrender.com", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      // localStorage.setItem(
      //   "passwords",
      //   JSON.stringify(passwordArray.filter((item) => item.id !== id))
      // );
      console.log(passwordArray);
      toast(" Password Deleted", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const editPassword = (id) => {
    console.log("Edit Password with id:", id);
    setform({ ...passwordArray.filter((i) => i.id === id)[0], id: id });
    setpasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={"Bounce"}
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="p-4 md:mycontainer mx-auto rounded-xs min-h-[85.7vh] md:w-3/4">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">
          Your Own password Manager
        </p>
        <div className="flex flex-col py-4 gap-3 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter Website URL"
            className="bg-white rounded-full border border-green-500 w-full px-4 py-1"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col md:flex-row gap-3 md:gap-10 w-full">
            <input
              value={form.Username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="bg-white rounded-full border border-green-500 w-full box-border px-4 py-1"
              type="text"
              name="Username"
              id="username"
            />
            <div className="relative w-full">
              <input
                value={form.Password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="bg-white rounded-full border border-green-500 w-full px-4 py-1"
                type="password"
                name="Password"
                id="password"
              />
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center bg-green-500 hover:bg-green-600 cursor-pointer gap-2 px-4 py-2 rounded-full w-fit border border-green-700 font-semibold"
          >
            <lord-icon
              src="https://cdn.lordicon.com/gzqofmcx.json"
              trigger="hover"
              colors="primary:#121331,secondary:#121331"
            ></lord-icon>
            Save Password
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div>No passwords to Show</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-1">Site</th>
                  <th className="py-1">Username</th>
                  <th className="py-1">Password</th>
                  <th className="py-1">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-1 border border-white text-center">
                        <div className="flex items-center justify-center gap-1">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <div
                            className="lord-icon-copy cursor-pointer size-7"
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            <lord-icon
                              style={{ width: "25px", height: "25px" }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-1 border border-white text-center">
                        <div className="flex items-center justify-center gap-1">
                          {item.Username}
                          <div
                            className="lord-icon-copy cursor-pointer size-7"
                            onClick={() => {
                              copyText(item.Username);
                            }}
                          >
                            <lord-icon
                              style={{ width: "25px", height: "25px" }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-1 border border-white box-border text-center w-1/3">
                        <div className="flex box-border items-center justify-center gap-1">
                          {visiblePasswords[item.id]
                            ? item.Password
                            : "*".repeat(item.Password.length)}

                          <span
                            className="cursor-pointer"
                            onClick={() => showPassword(item.id)}
                          >
                            <img
                              ref={ref}
                              width={20}
                              src={
                                visiblePasswords[item.id]
                                  ? hideIcon
                                  : viewIcon
                              }
                              alt="eye"
                            />
                          </span>
                          <div
                            className="lord-icon-copy flex cursor-pointer size-7 "
                            onClick={() => {
                              copyText(item.Password);
                            }}
                          >
                            <lord-icon
                              style={{ width: "25px", height: "25px" }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-1 border border-white text-center w-1/8">
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => {
                            editPassword(item.id);
                          }}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/gwlusjdu.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => {
                            deletePassword(item.id);
                          }}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/xyfswyxf.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
