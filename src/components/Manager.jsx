import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import viewIcon from "../assets/view.png";
import hideIcon from "../assets/hide.png";

const Manager = () => {
  const ref = useRef();
  const [form, setform] = useState({ site: "", Username: "", Password: "" });
  const [passwordArray, setpasswordArray] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  let getPasswords = async () => {
    // let req = await fetch("http://localhost:3000");
    let req = await fetch(
      "https://passop-password-manager-mongodb.onrender.com",
    );
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
      let res = await fetch(
        "https://passop-password-manager-mongodb.onrender.com",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        },
      );
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

      <div className="p-4 md:mycontainer mx-auto rounded-xs min-h-[85.7vh] md:w-3/4 relative z-10">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-indigo-500">&lt;</span>
          <span className="text-white">Nex</span>
          <span className="text-indigo-500">Lockr /&gt;</span>
        </h1>

        <p className="text-indigo-300 text-lg text-center mt-2 mb-6">
          Secure Password Manager
        </p>

        <div className="flex flex-col py-4 gap-4 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter Website URL"
            className="bg-gray-950 text-gray-100 rounded-full border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none w-full px-5 py-2.5 placeholder-gray-400 transition-all"
            type="text"
            name="site"
            id="site"
          />

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <input
              value={form.Username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="bg-gray-950 text-gray-100 rounded-full border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none w-full px-5 py-2.5 placeholder-gray-400 transition-all"
              type="text"
              name="Username"
              id="username"
            />

            <div className="relative w-full">
              <input
                value={form.Password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="bg-gray-950 text-gray-100 rounded-full border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none w-full px-5 py-2.5 placeholder-gray-400 transition-all"
                type="password"
                name="Password"
                id="password"
              />
            </div>
          </div>

          <button
            onClick={savePassword}
            className="relative inline-flex h-12 w-fit overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50 mt-4"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex gap-2 h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 px-8 py-1 text-sm font-medium text-gray-50 backdrop-blur-3xl">
              <lord-icon
                src="https://cdn.lordicon.com/gzqofmcx.json"
                trigger="hover"
                colors="primary:#ffffff,secondary:#ffffff"
              ></lord-icon>
              Save Password
            </span>
          </button>
        </div>

        <div className="passwords mt-8">
          <h2 className="font-bold text-2xl py-4 text-white">Your Passwords</h2>
          {passwordArray.length === 0 && (
            <div className="text-gray-400">No passwords to Show</div>
          )}
          {passwordArray.length !== 0 && (
            <div className="overflow-x-auto">
              <table className="table-auto w-full rounded-md overflow-hidden mb-10 border border-gray-700">
                <thead className="bg-gray-900 text-indigo-300">
                  <tr>
                    <th className="py-3 px-2 border-b border-gray-700 text-center">
                      Site
                    </th>
                    <th className="py-3 px-2 border-b border-gray-700 text-center">
                      Username
                    </th>
                    <th className="py-3 px-2 border-b border-gray-700 text-center">
                      Password
                    </th>
                    <th className="py-3 px-2 border-b border-gray-700 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-950 text-gray-200">
                  {passwordArray.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-900 transition-colors"
                      >
                        <td className="py-2 border-b border-gray-800 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <a
                              href={item.site}
                              target="_blank"
                              className="hover:text-indigo-400 transition-colors"
                            >
                              {item.site}
                            </a>
                            <div
                              className="lord-icon-copy cursor-pointer flex items-center"
                              onClick={() => {
                                copyText(item.site);
                              }}
                            >
                              <lord-icon
                                style={{ width: "22px", height: "22px" }}
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                                colors="primary:#a5b4fc"
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 border-b border-gray-800 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {item.Username}
                            <div
                              className="lord-icon-copy cursor-pointer flex items-center"
                              onClick={() => {
                                copyText(item.Username);
                              }}
                            >
                              <lord-icon
                                style={{ width: "22px", height: "22px" }}
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                                colors="primary:#a5b4fc"
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 border-b border-gray-800 text-center md:w-1/3">
                          <div className="flex items-center justify-center gap-3">
                            <span className="tracking-widest w-32 inline-block overflow-hidden text-ellipsis whitespace-nowrap text-center">
                              {visiblePasswords[item.id]
                                ? item.Password
                                : "•".repeat(item.Password.length)}
                            </span>

                            <span
                              className="cursor-pointer flex items-center justify-center shrink-0 min-w-[24px] min-h-[24px]"
                              onClick={() => showPassword(item.id)}
                            >
                              <img
                                ref={ref}
                                src={
                                  visiblePasswords[item.id]
                                    ? hideIcon
                                    : viewIcon
                                }
                                alt="eye"
                                className="invert h-5 w-5 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                              />
                            </span>
                            <div
                              className="lord-icon-copy flex cursor-pointer items-center"
                              onClick={() => {
                                copyText(item.Password);
                              }}
                            >
                              <lord-icon
                                style={{ width: "22px", height: "22px" }}
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                                colors="primary:#a5b4fc"
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 border-b border-gray-800 text-center">
                          <div className="flex justify-center gap-3">
                            <span
                              className="cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => {
                                editPassword(item.id);
                              }}
                            >
                              <lord-icon
                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                trigger="hover"
                                style={{ width: "24px", height: "24px" }}
                                colors="primary:#ffffff"
                              ></lord-icon>
                            </span>
                            <span
                              className="cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => {
                                deletePassword(item.id);
                              }}
                            >
                              <lord-icon
                                src="https://cdn.lordicon.com/xyfswyxf.json"
                                trigger="hover"
                                style={{ width: "24px", height: "24px" }}
                                colors="primary:#ef4444"
                              ></lord-icon>
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
