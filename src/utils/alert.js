// src/utils/alert.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const MySwal = withReactContent(Swal);


export const formatTitle = (str = "") =>
  str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
