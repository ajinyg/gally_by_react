require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

var yeoImagesJson = require('../data/imgJson.json');

yeoImagesJson = (function imagesUrl(dataArr){
	for (var i = 0,j= dataArr.length;i<j; i++) {
		var ImagesData = dataArr[i];
		ImagesData.imageURL = require('../images/'+ImagesData.fileName)
		dataArr[i] = ImagesData;
	}
	return dataArr;
})(yeoImagesJson);
function getRangeRandom(low,high){
  return Math.ceil(Math.random()*(high - low) + low);
 }
 class ImgFigue extends React.Component{
      render(){
        var styleObj = {};
        //如果props属性中指定了这张图片的位置，则使用
        if(this.props.arrange.pos){
          styleObj = this.props.arrange.pos;
        }
        return (
          <figure className="img-figure"  style={styleObj}>
              <img src={this.props.data.imageURL}alt={this.props.data.title}/>
              <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
              </figcaption>
          </figure>
        )
      }
 }
 
class AppComponent extends React.Component {
   //利用rearrange函数，居中对应index的图片 @param index 需要被居中的图片对应的图片信息数组的index值，return {Function}
  center(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  }


  constructor(props){
    super(props)
    this.state = {
      imgsArrangeArr:[
        {
          /*pos:{
            left:'0',
            top:'0'
          },
          rotate:0,// 旋转角度
          isInverse:false,//图片正反面
          isCenter:false
          */
        }
      ]

    }
    this.Constant = {
      centerpos:{
        left:0,
        right:0
      },
      hPosRange:{//水平方向的取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{//垂直方向的取值范围
        x:[0,0],
        topY:[0,0]
      }
    }

  }
 //组件加载后，为每张图片计算其位置的范围
  componentDidMount(){
     //组件加载以后，为每张图片计算其位置范围
      var stateDOM = ReactDOM.findDOMNode(this.refs.state),//首先拿到舞台的大小
          stateW = stateDOM.scrollWidth,
          stateH = stateDOM.scrollHeight,
          halfStageW = Math.ceil(stateW/2),
          halfStageH = Math.ceil(stateH/2);
     //拿到一个imgFigure的大小
     var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
          imgW = imgFigureDOM.scrollWidth,
          imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW/2),
          halfImgH = Math.ceil(imgH/2);

      //计算中心点的值
      this.Constant.centerpos = {
        left:halfStageW - halfImgW,
        right:halfStageH- halfImgH
      }
      //计算左侧的位置点
      this.Constant.hPosRange.leftSecX[0]= -halfImgW;
      this.Constant.hPosRange.leftSecX[1]= halfStageW - halfImgW*3;
      //计算右侧的位置点
      this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightSecX[1] = stateW - halfImgW;
      this.Constant.hPosRange.y[0] = -halfImgH;
      this.Constant.hPosRange.y[1] = stateH - halfImgH;

      //上侧区域的取值范围
       this.Constant.vPosRange.topY[0] = -halfImgH;
       this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
       this.Constant.vPosRange.x[0] = halfStageW - imgW;
       this.Constant.vPosRange.x[1] = halfStageW;

       //第一张居中
       this.rearrange(0);
  }
  rearrange(centerIndex){
     var imgsArrangeArr = this.state.imgsArrangeArr,
          Constant = this.Constant,
          centerpos = Constant.centerpos,
          hPosRange = Constant.hPosRange,
          vPosRange = Constant.vPosRange,
          hPosRangeLeftSecX = hPosRange.leftSecX,
          hPosRangeRightSecX = hPosRange.rightSecX,
          hPosRangeY = hPosRange.y,
          vPosRangeX = vPosRange.x,
          vPosRangeTopY = vPosRange.topY,

          imgsArrangeTopArr = [],
          topImgNum = Math.ceil(Math.random * 2),
          topImgSpliceIndex = 0,
          imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
          //首先居中，centerIndex图片
           imgsArrangeCenterArr[0].pos = centerpos;
          //取出要布局上侧图片的信息状态
         topImgSpliceIndex = Math.ceil( Math.random * (imgsArrangeArr.length - topImgNum)),
         imgsArrangeTopArr = imgsArrangeArr.splice(imgsArrangeTopArr,topImgNum);
         imgsArrangeTopArr.forEach(function(value,index){
                imgsArrangeTopArr[index].pos = {
                  top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                  left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                }
         });
         //布局左右两侧图片
         //for(var i = 0,j = imgsArrangeArr.length,k = j/2;i < j;i++){
         for (var i = 0, j=imgsArrangeArr.length,k=j/2; i<j; i++) {
           var hPosRangeLORX = null;
           if(i<k){//前半部分布局左边，右半部分布局右边
              hPosRangeLORX = hPosRangeLeftSecX;   
           }else{
              hPosRangeLORX = hPosRangeRightSecX;    
           }
           imgsArrangeArr[i].pos = {
              top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
              left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
           }
         }
         if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
         }
         imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
         this.setState({
              imgsArrangeArr:imgsArrangeArr
         });
  }
  
  render() {
    var con =[],
      imgArr=[];
      yeoImagesJson.forEach(function(value,index){
        if(!this.state.imgsArrangeArr[index]){
          this.state.imgsArrangeArr[index] = {
            pos:{
              left:'0',
              top:'0'
            }
          }
        };
          imgArr.push(<ImgFigue data={value} ref={'imgFigure'+index} arrange = {this.state.imgsArrangeArr[index]}/>);
        
      }.bind(this));
    return (
      <div className="stage" ref="state">
        <div className="img-ser">
            {imgArr}
        </div>
        <div className="content">
          {con}
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
