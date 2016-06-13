import React,{Component} from "react"

export default class TagSelectorPanel extends Component{
	constructor(props){
		super(props);
		this.state = {
			selectTag:null
		}
	}

	render(){
		let tagLenth = this.props.tags.length,flag=0;
		let tags = this.props.tags.map((tag)=>{
			if(tag === ""){
				flag++;
			}
			let tagActiveClass = this.state.selectTag === tag ? "active":"";
			return (
				<a className={`tagItem ${tagActiveClass}`} href="javascript:void(0)" onClick={this.changeSelect.bind(this,tag)}>
					{tag}
				</a>
			)
		});
		if(flag === tagLenth){
			return <div className="hide"></div>
		}
		return (
			<div className="tags" style={{width:"7.5rem"}}>
				<div className="tagList">
				{tags}
				</div>
			</div>
		)
	}

	componentDidMount(){
		if(typeof this.props.tags !== "undefined" && this.props.tags.length > 0){
			this.changeSelect(this.props.tags[0]);
		}
	}

	changeSelect(tag){
		this.setState({selectTag:tag},()=>{
			window.scrollTo(0,0);
			this.props.onChange && this.props.onChange(tag);
		})
	}
}