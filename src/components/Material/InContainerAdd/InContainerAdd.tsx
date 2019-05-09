import * as React from 'react'
import styles from './InContainerAdd.module.css'
import TextField from '@material-ui/core/TextField';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { getQiniuToken, saveUploadResult } from '../../../apis/upload/qiniu'
import { handleAxiosAsyncError } from '../../../utils/helper/errorHandle/axiosError';
import * as qiniu from 'qiniu-js'
import { materialsPost } from '../../../apis/materials/materials';
import materialTypeByValue from '../../../utils/helper/typeReturner/materialTypeByValue';
const moment = require('moment')

const mStyles = (theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    }
  })

interface Props {
  classes: any
  materialCurrentValue: number
  handleMaterialChooseAndFresh: () => void
}

interface State {
  imgName: string
  videoName: string
  imgPreviewUrl: string
  imgNameError: string
  videoError: string
  videoPreviewUrl: string
}

class InContainerAdd extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      imgName: '',
      videoName: '',
      imgPreviewUrl: '',
      imgNameError: '',
      videoError: '',
      videoPreviewUrl: ''
    }
  }

  handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [name]: event.target.value } as Pick<State, keyof State>);
  };

  handleSubmitImage = async () => {
    const { imgName, imgPreviewUrl } = this.state
    const { materialCurrentValue, handleMaterialChooseAndFresh } = this.props
    const type = materialTypeByValue(materialCurrentValue)
    if (imgName === '' || type === null) {
      this.setState({
        imgNameError: 'error'
      })
      return
    }
    const materialArgs = {
      name: imgName,
      type: type,
      imgUrl: imgPreviewUrl
    }
    try {
      await materialsPost(materialArgs)
      handleMaterialChooseAndFresh()
    } catch (err) {
      handleAxiosAsyncError(err)
    }
  }

  handleSubmitVideo = async () => {
    const { videoName, videoPreviewUrl, imgPreviewUrl } = this.state
    const { materialCurrentValue, handleMaterialChooseAndFresh } = this.props
    const type = materialTypeByValue(materialCurrentValue)
    if (videoName === '' || type === null || imgPreviewUrl === '' || videoPreviewUrl === '') {
      this.setState({
        imgNameError: 'error'
      })
      return
    }
    const materialArgs = {
      name: videoName,
      type: type,
      imgUrl: imgPreviewUrl,
      videoUrl: videoPreviewUrl
    }
    try {
      await materialsPost(materialArgs)
      handleMaterialChooseAndFresh()
    } catch (err) {
      handleAxiosAsyncError(err)
    }
  }

  handleImageInputUpLoad = async (e: any) => {
    try {
      // console.log(e.target.files[0])
      const file = e.target.files[0]
      if (!file) {
        return
      }
      const { name } = file
      const time = moment().unix()
      const suffix = `${time}-${name}`
      const key = encodeURI(`${suffix}`)
      const qiniuToken: any = await getQiniuToken()
      const putExtra = {
        fname: file.name,
        params: {},
        mimeType: ["image/png", "image/jpeg", "image/jpg"]
      }
      const config = {
        useCdnDomain: true
      }
      const observable = qiniu.upload(file, key, qiniuToken.data, putExtra, config)
      const that = this
      const observer = {
        next(res: any) {
        },
        error(err: any) {
        },
        complete(res: any) {
          const uploadArgs = {
            size: file.size,
            name: res.hash,
            key: res.key
          }
          saveUploadResult(uploadArgs).then((r: any) => {
            that.setState({
              imgPreviewUrl: r.data.url
            })
          }).catch(e => {
            handleAxiosAsyncError(e)
          })
        }
      }
      const subscription = observable.subscribe(observer)
    } catch (err) {
      handleAxiosAsyncError(err)
    }
  }

  handleVideoInputUpload = async (e: any) => {
    try {
      // console.log(e.target.files[0])
      const file = e.target.files[0]
      if (!file) {
        return
      }
      const { name } = file
      const time = moment().unix()
      const suffix = `${time}-${name}`
      const key = encodeURI(`${suffix}`)
      const qiniuToken: any = await getQiniuToken()
      const putExtra = {
        fname: file.name,
        params: {},
        mimeType: ["video/mp4"]
      }
      const config = {
        useCdnDomain: true
      }
      const observable = qiniu.upload(file, key, qiniuToken.data, putExtra, config)
      const that = this
      const observer = {
        next(res: any) {
        },
        error(err: any) {
        },
        complete(res: any) {
          const uploadArgs = {
            size: file.size,
            name: res.hash,
            key: res.key
          }
          saveUploadResult(uploadArgs).then((r: any) => {
            that.setState({
              videoPreviewUrl: r.data.url
            })
          }).catch(e => {
            handleAxiosAsyncError(e)
          })
        }
      }
      const subscription = observable.subscribe(observer)
    } catch (err) {
      handleAxiosAsyncError(err)
    }
  }

  render() {
    const { classes, materialCurrentValue } = this.props
    const { imgPreviewUrl, imgNameError, videoError, videoPreviewUrl } = this.state
    return <div className={styles.containeradd}>
      {materialCurrentValue === 0 &&
        <>
          <TextField
            id="image-name"
            label="图片名称"
            className={classes.textField}
            value={this.state.imgName}
            onChange={this.handleChange('imgName')}
            margin="normal"
            autoFocus
            error={imgNameError === 'error'}
          />
          <input
            className={styles.imginput}
            onChange={e => this.handleImageInputUpLoad(e)}
            accept="image/*"
            id="img-upload"
            type="file"
          />
          {imgPreviewUrl !== '' && <img src={imgPreviewUrl} />}
          <label htmlFor="img-upload">
            <Button variant="contained" component="span">上传</Button>
          </label>
          <Button variant="contained" color="primary" onClick={this.handleSubmitImage}>提交</Button>
        </>}

      {materialCurrentValue === 1 &&
        <>
          <TextField
            id="video-name"
            label="视频名称"
            className={classes.textField}
            value={this.state.videoName}
            onChange={this.handleChange('videoName')}
            margin="normal"
            autoFocus
            error={videoError === 'error'}
          />
          <input
            className={styles.imginput}
            onChange={e => this.handleVideoInputUpload(e)}
            accept="video/*"
            id="video-upload"
            type="file"
          />
          {videoPreviewUrl !== '' && <>已上传视频: {videoPreviewUrl}</>}
          <label htmlFor="video-upload">
            <Button variant="contained" component="span">点击上传视频</Button>
          </label>

          <input
            className={styles.imginput}
            onChange={e => this.handleImageInputUpLoad(e)}
            accept="image/*"
            id="img-upload"
            type="file"
          />
          {imgPreviewUrl !== '' && <img src={imgPreviewUrl} />}
          <label htmlFor="img-upload">
            <Button variant="contained" component="span">点击上传视频封面</Button>
          </label>
          <Button variant="contained" color="primary" onClick={this.handleSubmitVideo}>提交</Button>
        </>}
    </div>
  }
}

export default withStyles(mStyles)(InContainerAdd)