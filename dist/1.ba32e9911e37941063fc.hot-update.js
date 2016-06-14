exports.id = 1;
exports.modules = [
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _tagSelectorPanel = __webpack_require__(4);

	var _tagSelectorPanel2 = _interopRequireDefault(_tagSelectorPanel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TagsOnProducts = function (_Component) {
	  _inherits(TagsOnProducts, _Component);

	  function TagsOnProducts(props) {
	    _classCallCheck(this, TagsOnProducts);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TagsOnProducts).call(this, props));

	    _this.state = {
	      selectTag: _this.props.data[0].Tag
	    };
	    return _this;
	  }

	  _createClass(TagsOnProducts, [{
	    key: "render",
	    value: function render() {
	      var _this2 = this;

	      return _react2.default.createElement(
	        "div",
	        { className: "tagsonproducts" },
	        _react2.default.createElement(_tagSelectorPanel2.default, { tags: this.getTags(), onChange: function onChange(tag) {
	            return _this2.setState({ selectTag: tag });
	          } }),
	        _react2.default.createElement(ProductWaterfall, { data: this.props.data, tag: this.state.selectTag })
	      );
	    }
	  }, {
	    key: "getTags",
	    value: function getTags() {
	      return this.props.data.map(function (item) {
	        return item.Tag;
	      });
	    }
	  }, {
	    key: "isPanelActive",
	    value: function isPanelActive(item) {
	      return this.state.selectTag === item.Tag;
	    }
	  }]);

	  return TagsOnProducts;
	}(_react.Component);

	exports.default = TagsOnProducts;

	var ProductWaterfall = function (_Component2) {
	  _inherits(ProductWaterfall, _Component2);

	  function ProductWaterfall(props) {
	    _classCallCheck(this, ProductWaterfall);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(ProductWaterfall).call(this, props));
	  }

	  _createClass(ProductWaterfall, [{
	    key: "render",
	    value: function render() {
	      var _this4 = this;

	      var waterList = this.props.data.map(function (item) {
	        if (item.Tag === _this4.props.tag) {
	          return item.products.map(function (item2, index) {
	            return _react2.default.createElement(
	              "div",
	              { className: "productItem", onClick: _this4.handerClick },
	              _react2.default.createElement("img", { className: "tagsonproductsImg", src: item2.picture }),
	              _react2.default.createElement(
	                "div",
	                { className: "tagsonproductsName" },
	                item2.name
	              ),
	              _react2.default.createElement(
	                "div",
	                { className: "tagsonproductPrice" },
	                "(item2.price)"
	              )
	            );
	          }, _this4);
	        }
	      }, this);
	      return _react2.default.createElement(
	        "div",
	        { className: "tagsProducts" },
	        waterList
	      );
	    }
	  }, {
	    key: "handerClick",
	    value: function handerClick() {
	      alert(999);
	    }
	  }]);

	  return ProductWaterfall;
	}(_react.Component);

/***/ }
];