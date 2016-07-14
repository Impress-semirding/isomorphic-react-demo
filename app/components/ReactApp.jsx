import React,{Component} from "react"
import TagSelectorPanel from "./tagSelectorPanel.jsx"



export default class TagsOnProducts extends Component{
  constructor(props){
    super(props);
    this.state = {
      data : this.props.data,
      selectTag:this.props.data[0].Tag,
    }
  }

  render(){
    return (
      <div className="tagsonproducts">
        <TagSelectorPanel tags={this.getTags()} onChange={(tag)=>this.setState({selectTag:tag})} />
        <ProductWaterfall data={this.state.data} tag={this.state.selectTag}/>
      </div>
    )
  }

  getTags(){
    return this.state.data.map((item)=>{
      return item.Tag;
    })
  }

  isPanelActive(item){
    return this.state.selectTag === item.Tag;
  }
}

class ProductWaterfall extends Component {
  constructor(props){
    super(props);
    this.state = {
      data : this.props.data,
    }
  }
  render(){
    let waterList = this.state.data.map((item)=>{
      if(item.Tag === this.props.tag){
        return item.products.map((item2,index)=>{
            return (
              <div className="productItem" onClick={this.loadXMLDoc.bind(this)}>
                <img className="tagsonproductsImg" src={item2.picture} />
                <div className="tagsonproductsName">{item2.name}</div>
                <div className="tagsonproductPrice">{item2.price}</div>
              </div>
            )
        },this)
      }
    },this)
    return (
      <div className="tagsProducts">{waterList}</div>
      )
  }
  loadXMLDoc(){
    var xmlhttp,self= this;
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    }
    else{// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
        var myArr = JSON.parse(xmlhttp.responseText);
        self.setState({data:self.state.data.concat(myArr)});
      }
    }
    xmlhttp.open("GET","/loader-more",true);
    xmlhttp.send();
  }
}

