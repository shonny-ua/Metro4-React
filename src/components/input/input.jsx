import React from "react";
import "./input.less";
import Button from "../button/button.jsx";

export default class Input extends React.Component {
    static defaultProps = {
        name: "",
        placeholder: "",
        value: "",
        type: 'text',
        append: "",
        prepend: "",
        clear: true,
        reveal: true,
        search: false,
        searchType: 'custom',
        history: false,
        preventSubmit: true,
        autocomplete: [],
        autocompleteHeight: 200,
        customButtons: [],
        onSearch: () => {},
        onClear: () => {},
        onReveal: () => {},
        onChange: () => {},
        onKeyUp: () => {},
        onBlur: () => {},
        onFocus: () => {}
    };

    constructor(props){
        super(props);

        this.state = {
            initValue: props.value,
            value: props.value,
            inputType: props.type,
            focus: false
        };

        this.input = null;
        this.history = [];
        this.historyIndex = -1;
        this.autocomplete = [...this.props.autocomplete].sort( (a, b) => a > b );

        this.onChange = this.onChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.changeInputType = this.changeInputType.bind(this);
        this.clearValue = this.clearValue.bind(this);
        this.searchValue = this.searchValue.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.autocompleteItemClick = this.autocompleteItemClick.bind(this);
        this.focus = this.focus.bind(this);
    }

    componentDidMount(){
        this.input.addEventListener("blur", this.onBlur);
        this.input.addEventListener("focus", this.onFocus);
    }

    componentWillUnmount() {
        this.input.removeEventListener("blur", this.onBlur);
        this.input.removeEventListener("focus", this.onFocus);
    }

    static getDerivedStateFromProps(props, state){
        if (props.value !== state.initValue) {
            return {
                value: props.value,
                initValue: props.value
            }
        }
        return null;
    }

    onBlur(e){
        this.setState({
            focus: false
        });
        this.props.onBlur(e);
    }

    onFocus(e){
        this.setState({
            focus: true
        });
        this.props.onFocus(e);
    }

    onChange(e){
        const {onChange} = this.props;

        this.setState({
            value: e.target.value
        });

        onChange(e);
    }

    onKeyUp(e){
        let val = this.input.value;

        if (this.props.history) {
            if (e.keyCode === 13) { //Enter
                this.history.push(val);
                this.historyIndex = this.history.length - 1;
                this.clearValue(e);
                if (this.props.preventSubmit) {
                    e.preventDefault();
                }
            }

            if (e.keyCode === 38) { //Up
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.setState({
                        value: this.history[this.historyIndex]
                    });
                }
            }

            if (e.keyCode === 40) { //Down
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.setState({
                        value: this.history[this.historyIndex]
                    });
                }
            }
        }

        this.props.onChange(e);
        this.props.onKeyUp(e);
    }

    changeInputType(){
        const {onReveal} = this.props;

        this.setState((prev) => ({
            inputType: prev.inputType === 'text' ? 'password' : 'text'
        }));

        onReveal(this.input);
    }

    clearValue(e){
        const {onClear} = this.props;

        this.setState({
            value: ""
        });

        this.focus();

        onClear(e);
    }

    searchValue(){
        const {searchType, onSearch} = this.props;

        if (searchType === 'custom') {
            onSearch(this.input.value, this.input);
        } else {
            if (this.input.form)
                this.input.form.submit();
        }
    }

    autocompleteItemClick(e){
        const value = e.target.getAttribute('data-item');
        this.setState({
            value: value
        });
    }

    focus(){
        this.input.focus();
    }

    render() {
        const {type, append, prepend, clear, reveal, search, searchType, history, preventSubmit, customButtons, autocomplete, autocompleteHeight, onSearch, onClear, onReveal, ...props} = this.props;
        const {value, inputType, focus} = this.state;
        const buttons = clear || reveal || search;

        const autocompleteItemClick = this.autocompleteItemClick;

        return (
            <div className={'input ' + (focus ? 'focused' : '')}>

                {prepend !== "" && (
                    <span className='prepend'>{prepend}</span>
                )}

                <input {...props} type={inputType} value={value} onChange={this.onChange} ref={ref => this.input = ref} onKeyUp={this.onKeyUp}/>

                {buttons && (
                    <div className='button-group'>
                        {clear && (
                            <Button cls='input-clear-button' type='button' onClick={this.clearValue} tabIndex={-1}>
                                <span className='default-icon-cross'/>
                            </Button>
                        )}
                        {type === 'password' && reveal && (
                            <Button cls='input-reveal-button' type='button' onClick={this.changeInputType} tabIndex={-1}>
                                <span className='default-icon-eye'/>
                            </Button>
                        )}
                        {search && (
                            <Button cls='input-search-button' type='button' onClick={this.searchValue} tabIndex={-1}>
                                <span className='default-icon-search'/>
                            </Button>
                        )}

                        {customButtons.map(function(btn, index){
                            return (
                                <Button key={index} {...btn}/>
                            )
                        })}
                    </div>
                )}

                {append !== "" && (
                    <span className='append'>{append}</span>
                )}

                {autocomplete.length > 0 && (
                    <div className='autocomplete-list'>
                        {
                            this.autocomplete.map(function(item, index) {
                                const searchIndex = item.toLowerCase().indexOf(value.toLowerCase());
                                const itemValue = `${item.substr(0, searchIndex)}<strong>${item.substr(searchIndex, value.length)}</strong>${item.substr(searchIndex + value.length)}`;

                                return (
                                    <div data-item={item}
                                         className='item'
                                         key={index}
                                         hidden={item === value || value === '' || searchIndex === -1}
                                         dangerouslySetInnerHTML={{__html: itemValue}}
                                         onClick={autocompleteItemClick}/>
                                )
                            })
                        }
                    </div>
                )}
            </div>
        )
    }
}