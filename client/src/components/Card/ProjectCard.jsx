import React from "react";
import { useAuth } from "../../context/AuthContext";
import avtar from "../../assests/avtar.jpg"

const ProjectCard = ({ item }) => {
  const {user} = useAuth()
  return (
    <div className=" w-full md:w-56 h-72 border-[0.123px] border-lightgray rounded-md shadow-sm overflow-hidden bg-white">
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-[70%] object-cover"
      />
      <div className="flex items-center gap-4 p-2">
        <img
          className="inline-block h-8 w-8 rounded-full"
          alt='project'
          src={avtar || user?.img}
        />
        <div className="flex flex-col mt-2">
          <span className="font-bold text-xl">{item.title}</span>
          <span className=" text-lightgray text-sm">{item.name}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
