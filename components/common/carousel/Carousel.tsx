import { FC, useState, Children } from 'react';
import {Fade, Slide, IconButton } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

export const Carousel: FC = ({children}) => {
  const [active, setActive] = useState(0);
  const length = Children.toArray(children).length;
  const pressIndicator = (index: number) => {
    setActive(index);
  }
  const next = () => {
    const next = active + 1 > length - 1 ? 0 : active + 1;
    setActive(next);

  }
  const prev = () => {
    const prev = active - 1 < 0 ? length! - 1 : active - 1;
    setActive(prev);
  }
  
  const indicators = true;
  const animation = 'fade';
  return(
    <div className={`Carousel ""`}>
      {
        Array.isArray(children) ?
          children.map((child, index) =>{
            return (
              <CarouselItem key={index} active={index===active ? true : false} child={child} animation={animation}/>
            )
          })
          :
          <CarouselItem key={0} active={true} child={children} />
      }
      <div className="Next ButtonWrapper">
          <IconButton className="Next Button mui--align-middle" onClick={next}>
              <NavigateNextIcon/>
          </IconButton>
      </div>

      <div className="Prev ButtonWrapper">
          <IconButton className="Prev Button mui--align-middle" onClick={prev}>
              <NavigateBeforeIcon/>
          </IconButton>
      </div>
      
      {indicators ? <Indicators length={length} active={active} press={pressIndicator}/> : null}
    </div>
  )
}

const CarouselItem = (props: any) => {
  return (
  <div className="CarouselItem" hidden={!props.active}>
      {props.animation === "slide" ?
        <Slide direction="left" in={props.active} timeout={200}>
            <div>
                {props.child}
            </div>
        </Slide>
        :
        <Fade in={props.active} timeout={500}>
            <div>
                {props.child}
            </div>
        </Fade>
      }
  </div>
  )
}
const Indicators = (props: any) => {
  let indicators = [];
  for (let i = 0; i < props.length; i++)
  {
      const className = i === props.active ? "Active Indicator" : "Indicator";
      const item = <FiberManualRecordIcon key={i} className={className} onClick={() => {props.press(i)}}/>;
      indicators.push(item);
  }

  return (
      <div className="Indicators">
          {indicators}
      </div>
  )  
}