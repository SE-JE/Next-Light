import SidebarComponent from "@/components/base.components/navigation/Sidebar.component";
import { ToggleProvider } from "@/context/ToogleContext";
import { faStar, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Input() {
  return (
    <>
      <ToggleProvider>
        <div>
          <SidebarComponent
            head={
              <a href="#" className="px-4 text-2xl font-extrabold italic">
                NEXT-LIGHT
              </a>
            }
            items={[
              {
                label: "Dashboard",
                items: [
                  {
                    label: "Dashboard",
                    left_content: <FontAwesomeIcon icon={faTableCells} />,
                    path: "/",
                  },
                ],
              },
              {
                label: "Component",
                collapse: true,
                items: [
                  {
                    label: "Button",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/button",
                  },
                  {
                    label: "Input",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/input",
                  },
                ],
              },
            ]}
          />
        </div>
      </ToggleProvider>
    </>
  );
}
