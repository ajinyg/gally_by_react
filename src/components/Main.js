require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeoImagesJson = require('../data/imgJson.json')
yeoImagesJson = (function imagesUrl(dataArr){
	for (var i = 0,j= dataArr.length;i<j; i++) {
		var ImagesData = dataArr[i];
		ImagesData.imageURL = require('../images/'+ImagesData.fileName)
		dataArr[i] = ImagesData;
	}
	return dataArr;
})(yeoImagesJson);		 
class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">欢迎来到react-webpack</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
