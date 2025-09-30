import * as Yup from "yup";

export const createUserValidationSchema = (existingUsers, editingUserId = null) => {
  return Yup.object().shape({
    hoTen: Yup.string()
      .required("Họ tên là bắt buộc")
      .min(3, "Họ tên phải có ít nhất 3 ký tự")
      .max(50, "Họ tên không được quá 50 ký tự"),

    email: Yup.string()
      .required("Email là bắt buộc")
      .email("Email không đúng định dạng")
      .test("unique-email", "Email này đã được sử dụng", function (value) {
        if (!value) return true; // Bỏ qua nếu email rỗng (sẽ fail ở required)

        // Check trùng email
        const isDuplicate = existingUsers.some(
          (user) => user.email.toLowerCase() === value.toLowerCase() && user.id !== editingUserId // Loại trừ user đang sửa
        );

        return !isDuplicate;
      }),

    vaiTro: Yup.string()
      .required("Vai trò là bắt buộc")
      .oneOf(["Admin", "User", "Guest"], "Vai trò không hợp lệ"),

    ngaySinh: Yup.date()
      .required("Ngày sinh là bắt buộc")
      .max(new Date(), "Ngày sinh không thể ở tương lai")
      .test("age", "Tuổi phải từ 18 trở lên", function (value) {
        if (!value) return false;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= 18;
        }
        return age >= 18;
      }),
  });
};

// Export schema cũ để backward compatibility
export const userValidationSchema = createUserValidationSchema([]);
