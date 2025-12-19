// src/utils/alert.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const MySwal = withReactContent(Swal);


export const formatTitle = (str = "") =>
  str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());


export const getInitials = (name = "") => {
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0]?.toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export const getBgColor = (name = "") => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-indigo-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
