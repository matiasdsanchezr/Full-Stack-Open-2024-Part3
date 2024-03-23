const Filter = ({ changeFilterHandler }) => {
  return (
    <div>
      Name: <input onChange={changeFilterHandler} />
    </div>
  );
};
export default Filter;
