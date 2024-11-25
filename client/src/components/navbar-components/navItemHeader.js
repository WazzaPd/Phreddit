const NavItemHeader = (props) => {
  const { divId, divClass, imgClass, imgAlt, text, pId, onClick } = props;

  return (  
      <div id={divId ? divId : undefined} className={divClass ? divClass : undefined} onClick = {onClick}>
          <p id = {pId ? pId : undefined}>{text}</p>
          <img className={imgClass} src={require("../../imgs/carret-img.png")} alt={imgAlt} />
      </div>
  );
}

export default NavItemHeader;