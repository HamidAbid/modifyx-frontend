import React from "react";
import { NavLink } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="py-20 bg-slate-950">
      <h1 className="text-4xl text-center my-5 text-red-600">No Page Found</h1>
      <div className="flex justify-center ">
        <NavLink
          to="/"
          className="text-2xl btn my-5 p-2 rounded-xl text-center w-60"
        >
          GO TO HOME
        </NavLink>
      </div>
    </div>
  );
}
