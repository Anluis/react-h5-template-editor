import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import IStoreState from '../../types/IStoreState';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { setMaterialCurrentValue } from '../../actions/status';
import ImageCard from '../Cards/ImageCard/ImageCard';
import moduleStyles from './Material.module.css'
import VideoCard from '../Cards/VideoCard/VideoCard';
import LottieCard from '../Cards/LottieCard/LottieCard';
import { RouteComponentProps, withRouter } from 'react-router-dom';

function TabContainer(props: any) {
  return (
    <Typography component="div" style={{ padding: 8 * 3, }} className={moduleStyles.ctn}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = (theme: any) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

interface OwnProps extends RouteComponentProps {
  classes: any
  materialCurrentValue: number
}

interface DispatchProps {
  setMaterialCurrentValue: (value: number) => void
}

type Props = OwnProps & DispatchProps

class Material extends React.Component<Props> {

  handleChange = (event: any, value: any) => {
    this.props.setMaterialCurrentValue(value)
  };

  render() {
    const { pathname } = this.props.location
    const belong = pathname.includes('materials') ? 'materials' : 'dialog'
    const { classes, materialCurrentValue: value } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="图片" />
            <Tab label="视频" />
            <Tab label="Lottie动画" />
            <Tab label="音乐" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>
          <ImageCard belong={belong} imgUrl={'https://dn-coding-net-production-static.qbox.me/d4c0b468-29dd-4996-ae65-58a4b038fc39.JPG?imageMogr2/auto-orient/format/jpeg/crop/!538x538a0a0'} />
        </TabContainer>}
        {value === 1 && <TabContainer>
          <VideoCard belong={belong} videoUrl={'https://cdn.xingstation.cn/fe/cms/sample/vedio.mp4'} />
        </TabContainer>}
        {value === 2 && <TabContainer>
          <LottieCard belong={belong} path={'http://cdn.xingstation.cn/fe/marketing/jqsjb/json/data.json'} assetsPath={'http://cdn.xingstation.cn/fe/marketing/jqsjb/img/'} />
        </TabContainer>}
        {value === 3 && <TabContainer>暂无音乐</TabContainer>}
      </div>
    );
  }
}

const mapStateToProps = (state: IStoreState) => {
  const { materialCurrentValue } = state.status
  return {
    materialCurrentValue
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>): DispatchProps => {
  return {
    setMaterialCurrentValue: (value: number) => {
      dispatch(setMaterialCurrentValue(value))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Material)))