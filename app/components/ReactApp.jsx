import React,{Component} from "react"
import TagSelectorPanel from "./tagSelectorPanel.jsx"



export default class TagsOnProducts extends Component{
  constructor(props){
    super(props);
    this.state = {
      selectTag:this.props.data[0].Tag,
    }
  }

  render(){
    return (
      <div className="tagsonproducts">
        <TagSelectorPanel tags={this.getTags()} onChange={(tag)=>this.setState({selectTag:tag})} />
        <ProductWaterfall data={this.props.data} tag={this.state.selectTag}/>
      </div>
    )
  }

  getTags(){
    return this.props.data.map((item)=>{
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
  }
  render(){
    let waterList = this.props.data.map((item)=>{
      if(item.Tag === this.props.tag){
        return item.products.map((item2,index)=>{
            return (
              <div className="productItem" onClick={this.alertT}>
                <img className="tagsonproductsImg" src={item2.picture} />
                <div className="tagsonproductsName">{item2.name}</div>
                <div className="tagsonproductPrice">(item2.price)</div>
              </div>
            )
        },this)
      }
    },this)
    return (
      <div className="tagsProducts">{waterList}</div>
      )
  }
  alertT(){
    return function(){
          alert(11);

    }
  }
}

