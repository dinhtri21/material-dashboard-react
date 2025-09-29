import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";

const usersData = [
  {
    id: 1,
    hoTen: "Nguyễn Văn An",
    email: "vanAn@gmail.com",
    vaiTro: "Admin",
  },
  {
    id: 2,
    hoTen: "Trần Thị Bình",
    email: "binh@gmail.com",
    vaiTro: "User",
  },
  {
    id: 3,
    hoTen: "Lê Hoàng Cường",
    email: "cuong@gmail.com",
    vaiTro: "User",
  },
  {
    id: 4,
    hoTen: "Phạm Thị Dung",
    email: "dung@gmail.com",
    vaiTro: "User",
  },
  {
    id: 5,
    hoTen: "Võ Minh Tuấn",
    email: "tuan@gmail.com",
    vaiTro: "Admin",
  },
  {
    id: 6,
    hoTen: "Đặng Thị Hoa",
    email: "hoa@gmail.com",
    vaiTro: "User",
  },
];

export default function data() {
  const VaiTro = ({ vaiTro }) => {
    let color;
    switch (vaiTro) {
      case "Admin":
        color = "error";
        break;
      case "Manager":
        color = "warning";
        break;
      case "User":
      default:
        color = "info";
        break;
    }

    return (
      <MDTypography variant="caption" color={color} fontWeight="bold" textGradient>
        {vaiTro}
      </MDTypography>
    );
  };

  VaiTro.propTypes = {
    vaiTro: PropTypes.string.isRequired,
  };

  return {
    columns: [
      {
        Header: (
          <MDTypography
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            color="secondary"
          >
            ID
          </MDTypography>
        ),
        accessor: "id",
        width: "10%",
        align: "center",
      },
      {
        Header: (
          <MDTypography
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            color="secondary"
          >
            Họ Tên
          </MDTypography>
        ),
        accessor: "hoTen",
        width: "30%",
        align: "left",
      },
      {
        Header: (
          <MDTypography
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            color="secondary"
          >
            Email
          </MDTypography>
        ),
        accessor: "email",
        width: "35%",
        align: "left",
      },
      {
        Header: (
          <MDTypography
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            color="secondary"
          >
            Vai Trò
          </MDTypography>
        ),
        accessor: "vaiTro",
        width: "25%",
        align: "center",
      },
    ],

    rows: usersData.map((user) => ({
      id: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.id}
        </MDTypography>
      ),
      hoTen: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.hoTen}
        </MDTypography>
      ),
      email: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.email}
        </MDTypography>
      ),
      vaiTro: <VaiTro vaiTro={user.vaiTro} />,
    })),
  };
}
