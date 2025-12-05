import { TableSupervisionComponent} from "@components";

export default function Table() {
  return (
    <>
      <div>
        <TableSupervisionComponent
          title="User"
          fetchControl={{
            path: "users",
            params: {
              expand: ['roles'],
            },
          }}
          columnControl={[
            {
              selector: "name",
              label: "Nama",
              sortable: true,
              filterable: true,
              width: "350px",
            },
            {
              selector: "email",
              label: "Email",
              sortable: true,
              width: "250px",
            },
          ]}
          formControl={{
            forms: [
              {
                construction: {
                  name: "email",
                  label: "E-mail",
                  placeholder: "Ex: example@mail.com",
                  validations: "required|max:200",
                },
              },
              {
                construction: {
                  name: "name",
                  label: "Name",
                  placeholder: "Ex: Joko Gunawan",
                },
              },
              {
                construction: {
                  name: "password",
                  label: "Password",
                  placeholder: "Ex: secret123",
                }
              },
              {
                construction: {
                  type: "file",
                  name: "image",
                  label: "Picture",
                }
              },
            ],
          }}
          responsiveControl={{
            mobile: true,
          }}
        />
      </div>
    </>
  );
}