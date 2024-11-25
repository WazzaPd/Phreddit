const NavItem = (props) => {
  const { divId, divClass, imgClass, imgSrc, imgAlt, text } = props;
  return (  
      <div onClick={props.onClick ? ()=>props.onClick('home') : undefined} id={divId ? divId : undefined} className={divClass ? divClass : undefined}>
          <img className={imgClass} src={require(`../../imgs/${imgSrc}`)} alt={imgAlt} />
          <p>{text}</p>
      </div>
  );
}

export default NavItem;