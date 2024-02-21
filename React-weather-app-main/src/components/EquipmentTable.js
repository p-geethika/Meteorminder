import EquipmentCard from "./EquipmentCard";

export default function EquipmentTable(props) {
  console.log(props);
  return (
    <>
      <div className="EquipmentTable">
        <table>
          <tr>
            {props.equipments.map((e) => (
              <EquipmentCard equipmentInfo={e} key={e.object} />
            ))}
          </tr>
        </table>
      </div>
    </>
  );
}
