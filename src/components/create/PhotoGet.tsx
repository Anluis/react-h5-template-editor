import * as React from 'react';
const queryString = require('query-string');
import { PhotoGetCom } from '../../types/coms';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import zoomByDevice from '../../utils/helper/userWorkSuckers/zoomByDevice';

interface Props extends PhotoGetCom, RouteComponentProps {
  mode?: string;
  zIndex: number;
  maxZindex?: number;
}

interface OwnState {
  imgUrl: string | null;
}

type State = OwnState;

class PhotoGet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      imgUrl: null,
    };
  }
  componentDidMount() {
    this.fetchPhoto();
  }

  fetchPhoto = async () => {
    const { id } = queryString.parse(this.props.location.search);
    if (!id) {
      return;
    }
  };

  render() {
    const { width, height, filter, zIndex, mode, x, y, maxZindex } = this.props;
    const { imgUrl } = this.state;
    const bindStyle: React.CSSProperties = {
      width: width + 'px',
      height: height + 'px',
      zIndex: zIndex,
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
    };

    let bindStyleMaxExtra: React.CSSProperties = {
      width: width + 'px',
      height: height + 'px',
      zIndex: zIndex,
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
    };

    if (maxZindex) {
      bindStyleMaxExtra.zIndex = maxZindex;
      bindStyleMaxExtra.opacity = 0;
    }

    const bindStyleNotWithImg = {
      width: width + 'px',
      height: height + 'px',
      background: 'gray',
      filter: filter,
      display: 'flex',
      justifyContext: 'center',
      alignItems: 'center',
      zIndex: zIndex,
    };
    const innerImgStyle = {
      width: width * zoomByDevice() + 'px',
      height: height * zoomByDevice() + 'px',
    };
    if (mode !== 'editor') {
      bindStyle.left = x * zoomByDevice() + 'px';
      bindStyle.top = y * zoomByDevice() + 'px';
      bindStyle.height = height * zoomByDevice() + 'px';
      bindStyle.width = width * zoomByDevice() + 'px';
      bindStyleMaxExtra.left = x * zoomByDevice() + 'px';
      bindStyleMaxExtra.top = y * zoomByDevice() + 'px';
      bindStyleMaxExtra.height = height * zoomByDevice() + 'px';
      bindStyleMaxExtra.width = width * zoomByDevice() + 'px';
    }
    if (mode === 'editor') {
      return (
        <div style={bindStyleNotWithImg}>
          <div>提取的照片将会出现在这里</div>
          <div>
            照片比例为 {width} * {height}
          </div>
        </div>
      );
    }
    return (
      <>
        <div style={bindStyleMaxExtra}>
          {imgUrl !== null && <img src={imgUrl} style={innerImgStyle} />}
        </div>
        <div style={bindStyle}>
          {imgUrl !== null && <img src={imgUrl} style={innerImgStyle} />}
        </div>
      </>
    );
  }
}

export default withRouter(PhotoGet);
