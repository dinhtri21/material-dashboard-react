import * as Yup from "yup";

export const createUserValidationSchema = (existingUsers, editingUserId = null) => {
  return Yup.object().shape({
    first_name: Yup.string()
      .required("Tên là bắt buộc")
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(50, "Tên không được quá 50 ký tự"),

    last_name: Yup.string()
      .required("Họ là bắt buộc")
      .min(2, "Họ phải có ít nhất 2 ký tự")
      .max(50, "Họ không được quá 50 ký tự"),

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
  });
};

// Export schema đơn giản để backward compatibility
export const userValidationSchema = Yup.object({
  first_name: Yup.string().min(2, "Tên phải có ít nhất 2 ký tự").required("Tên là bắt buộc"),
  last_name: Yup.string().min(2, "Họ phải có ít nhất 2 ký tự").required("Họ là bắt buộc"),
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
});
