import React from "react";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { renderToString } from "react-dom/server";

const click = async () => {
  const { value: formValues } = await Swal.fire({
    title: "Enter your new password",
    html: `
    <div class="max-w-full rounded overflow-hidden shadow relative transform transition duration-300">
    <div class="relative mx-5 flex items-center justify-center">
        <input id="swal-input1" type="text" class="swal2-input w-full" placeholder="New password" style="-webkit-text-security:disc" >
        <span style="position: absolute; right: 50px; top: 63%; transform: translateY(-50%); cursor: pointer;" id="togglePassword1">
          ${renderToString(<FaEyeSlash />)}
        </span>
      </div>
      <div class="relative mx-5 flex items-center justify-center">
        <input id="swal-input2" type="text" class="swal2-input w-full" placeholder="Confirm password" style="-webkit-text-security:disc" >
        <span style="position: absolute; right: 50px; top: 63%; transform: translateY(-50%); cursor: pointer;" id="togglePassword2">
          ${renderToString(<FaEyeSlash />)}
        </span>
      </div>
    </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const newPassword = (
        document.getElementById("swal-input1") as HTMLInputElement
      ).value;
      const confirmPassword = (
        document.getElementById("swal-input2") as HTMLInputElement
      ).value;
      if (!newPassword || !confirmPassword) {
        Swal.showValidationMessage("คุณต้องใส่รหัสผ่านทั้งสองช่อง");
      } else if (newPassword.length < 8) {
        Swal.showValidationMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      } else if (newPassword !== confirmPassword) {
        Swal.showValidationMessage("รหัสผ่านไม่ตรงกัน");
      } else if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(newPassword)
      ) {
        Swal.showValidationMessage(
          "รหัสผ่านต้องประกอบด้วยตัวเลข ตัวอักษรพิมพ์เล็ก ตัวอักษรพิมพ์ใหญ่ และอักขระพิเศษ อย่างน้อย 1 ตัว และยาวอย่างน้อย 8 ตัวอักษร"
        );
      }
      return { newPassword };
    },
    didOpen: () => {
      let hide = true
      const togglePasswordVisibility = (id: string, iconId: string) => {
        const input = document.getElementById(id) as HTMLInputElement;
        const icon = document.getElementById(iconId) as HTMLElement;

        if (input && icon) {
          hide = !hide;

          if (hide) {
            icon.innerHTML = renderToString(<FaEyeSlash />);
            input.style.setProperty("-webkit-text-security", "disc");
          } else {
            icon.innerHTML = renderToString(<FaEye />);
            input.style.setProperty("-webkit-text-security", "none");
          }
        }
      };
      document
        .getElementById("togglePassword1")
        ?.addEventListener("click", () =>
          togglePasswordVisibility("swal-input1", "togglePassword1")
        );
      document
        .getElementById("togglePassword2")
        ?.addEventListener("click", () =>
          togglePasswordVisibility("swal-input2", "togglePassword2")
        );
    },
  });
};

const Test: React.FC = () => {
  return <button onClick={click}>คลิกที่นี่</button>;
};

export default Test;
