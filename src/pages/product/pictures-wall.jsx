import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../api'
import propTypes from 'prop-types'
import { BASE_IMG_URL } from "../../utils/constants";
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {
    static propTypes = {
        imgs: propTypes.array
    }

    constructor(props) {
        super(props)
        let fileList = []
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }

        // 初始化状态
        this.state = {
            previewVisible: false, //标识是否有大图预览
            previewImage: '', //大图url
            fileList
        };
    }


    //   隐藏modal
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = async ({ file, fileList }) => {
        // fileList 所有已上图图片的数组 file当前操作的文件
        // 一旦上传成功,将当前file的信息修正(name,url)  
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上传图片成功!')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }

        } else if (file.status === 'removed') { // 删除图片
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功!')
            } else {
                message.error('删除图片失败!')
            }
        }
        this.setState({ fileList })
    };

    // 获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload" //上传图片接口地址
                    accept='image/*' //可选择图片的类型
                    name='image'  /*请求参数名*/
                    listType="picture-card" //卡片样式
                    fileList={fileList} //所有已上传文件列表
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>


            </div>
        );
    }
}


