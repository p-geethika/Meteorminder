
export default function EquipmentCard(props) {
  console.log(props, props.emoji, props.object);
  return (
    <>
      <div className="Equipment">
        <h1>{props.equipmentInfo.emoji}</h1>
        <p>{props.equipmentInfo.object}</p>
      </div>
    </>
  );
}
