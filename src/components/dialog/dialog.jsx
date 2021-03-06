import React, {Component, Fragment} from "react";
import ReactDom from "react-dom";
import "./dialog.less";
import {Button} from "../../index";
import Body from "../body/body";

export default class Dialog extends Component {
    static defaultProps = {
        closeButton: true,
        open: false,
        title: "",
        actions: [],
        actionClickClose: true,
        modal: true,
        overlayColor: "#ffffff",
        overlayAlpha: 1,
        speed: .4,
        width: "auto",
        height: "auto",
        contentHeight: "auto",
        cls: "",
        clsTitle: "",
        clsContent: "",
        clsActions: ""
    };

    constructor(props){
        super(props);

        this.dialog = React.createRef();
        this.actions = [];
        this.state = {
            height: 0,
            width: 0
        };

        this.actions = this.props.actions.map((el, index) => {
            return (
                <Button {...el} key={index} onClick={this.actionButtonClick.bind(this, el.onClick)}/>
            )
        });

        this.onClose = this.onClose.bind(this);
        this.actionButtonClick = this.actionButtonClick.bind(this);
        this.windowResize = this.windowResize.bind(this);
    }

    actionButtonClick(cb){
        if (typeof cb === 'function') {
            cb();
        }
        if (this.props.actionClickClose) this.props.onClose();
    }

    componentDidMount(){
        const node = ReactDom.findDOMNode(this.dialog);
        this.setState({
            height: node.clientHeight,
            width: node.clientWidth
        });
        window.addEventListener("resize", this.windowResize);
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.windowResize);
    }

    windowResize(e){
        const node = ReactDom.findDOMNode(this.dialog);
        this.setState({
            height: node.clientHeight,
            width: node.clientWidth
        });
    }

    onClose(){
        this.props.onClose();
    }

    render(){
        const {open, title, closeButton, modal, overlayColor, overlayAlpha, speed, cls, clsTitle, clsContent, clsActions, height, width, contentHeight} = this.props;

        return (
            <Body>
                {modal && open && (
                    <div className={'overlay'} style={{backgroundColor: overlayColor, opacity: overlayAlpha}}>{''}</div>
                )}

                <div className={'dialog ' + cls} style={{
                    height: height,
                    width: width,
                    transition: `transform ${speed}s, opacity ${speed}s`,
                    transform: open ? 'translateY(0vh)' : 'translateY(-100vh)',
                    opacity: open ? 1 : 0,
                    marginTop: -this.state.height/2,
                    marginLeft: -this.state.width/2,
                }} ref={ref => this.dialog = ref}>

                    {closeButton && (
                        <Button cls={'square closer'} onClick={this.onClose}/>
                    )}

                    <div className={'dialog-title ' + clsTitle}>{title}</div>
                    <div className={'dialog-content ' + clsContent} style={{height: contentHeight}}>{this.props.children}</div>

                    {this.actions.length > 0 && (
                        <div className={'dialog-actions ' + clsActions}>{this.actions}</div>
                    )}

                </div>
            </Body>
        )
    }
}