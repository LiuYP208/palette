/**
 * Created by lenovo on 2017/3/1.
 */


var ColorPallate = function () {
    var self = this;
    //总体DIV
    self.target_div = "";
    //总体ID值
    self.target_div_ID = "";
    //渐变div 的ID
    //详情显示DIV
    self.m_BeginJson = {};
    //初始化函数
    this.init_palette = function (m_DivID, m_Json) {
        self.target_div_ID = m_DivID;
        self.target_div = document.getElementById(m_DivID);
        //解析 m_Json
        self.m_BeginJson = m_Json;
        //根据json 初始化 显示模式 分为3 钟模式  1.单块模式 -single 2.渐变调色板模式 -gradient 3.阈值调色板模式 -range 0.默认模式-default
        init_ShowMode();
        //根据显示模式 初始化
        init_div();
    };

    //显示模式  1.单块模式 -single 2.渐变调色板模式 -gradient 3.阈值调色板模式 -range 0.默认模式-default
    var palette_Mode = "default";
    var single_data = [];
    var gradient_data = [];
    var single_Num = 0;
    var gradient_Num = 0;
    var gradient_Min = 0;
    var gradient_Max = 0;

    //json 格式校验
    var json_CheckFunc = function () {
        if (self.m_BeginJson.palette_mode != undefined) {
            console.log("调色板控件json格式错误：palette_mode 不能为空。");
        }
    };

    /**
     * 解析json文件
     * @constructor
     */
    var init_ShowMode = function () {
        //判断模式
        if (self.m_BeginJson.palette_mode != undefined) {
            switch (self.m_BeginJson.palette_mode) {
                case "single":
                {
                    palette_Mode = "single";
                    init_json_single();
                    break;
                }
                case "gradient":
                {
                    palette_Mode = "gradient";
                    init_json_gradient();
                    break;
                }
                case "range":
                {
                    palette_Mode = "range";
                    break;
                }
            }
        }
    };

    /**
     * 初始化 json中single 部分
     */
    function init_json_single() {
        if (self.m_BeginJson.single != undefined) {
            single_data = self.m_BeginJson.single;
            //解析single
            single_Num = single_data.length;

        }
    }

    /**
     *初始化  json中 gradient 部分
     */
    function init_json_gradient() {
        if (self.m_BeginJson.gradient != undefined) {
            gradient_data = self.m_BeginJson.gradient;
            //解析gradient
            gradient_Num = gradient_data.length;
            gradient_Min = gradient_data[0][0];
            gradient_Max = gradient_data[gradient_Num - 1][0];
        }
    }

    /**
     * 初始化整体DIV显示
     */
    var init_div = function () {
        //通过主DIV 设置
        var m_SingleHtml = init_single();
        var m_gradientHtml = init_gradient();
        var m_detailHtml = init_detail();
        var TotalInner = m_SingleHtml + m_gradientHtml + m_detailHtml;
        //内容赋值入 html
        self.target_div.innerHTML = TotalInner;
        init_gradient_canvas();
        try {
            init_gradient_func();
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * 初始化 单块列表
     * @returns {string}
     */
    var init_single = function () {
        var m_inner = "";
        return m_inner;
    };

    //渐变div id
    self.gradient_id = '';
    //渐变 canvas id
    self.gradient_canvas_id = '';
    //初始化 过度列表
    var init_gradient = function () {
        self.gradient_id = self.target_div_ID + "_gradient";
        self.gradient_canvas_id = self.target_div_ID + "_gradient" + "_canvas";
        var m_inner = "<div id='" + self.gradient_id + "'>"
            + "<canvas style='width: 100%;height:10px;border:1px solid #404040;' id='" + self.gradient_canvas_id + "' title=''> "
            + "</canvas>"
            + "<div style='width:100%;height: 12px; font-size: 8px;'>"
            + "<a style='float: left;'>" + gradient_Min + "</a>"
            + "<a style='float: right;'>" + gradient_Max + "</a>"
            + "</div>"
            + "</div>";
        return m_inner;
    };
    //初始化事件
    var init_gradient_func = function () {
        var m_Canvas = document.getElementById(self.gradient_canvas_id);
        m_Canvas.onmouseover = gradient_canvasMouseOver;
        m_Canvas.onmouseout = gradient_canvasMouseOut;
        m_Canvas.onmousemove = gradient_canvasMouseMove;
    };

    /**
     * 渐变调色板 鼠标移入操作 显示详情界面
     * @param event
     */
    var gradient_canvasMouseOver = function (event) {
        var Show_Color_detail_canvas = document.getElementById(self.detail_id);
        Show_Color_detail_canvas.style.display = "block";
    };

    /**
     * 渐变调色板 鼠标移出操作 隐藏详情界面
     * @param event
     */
    var gradient_canvasMouseOut = function (event) {
        var Show_Color_detail_canvas = document.getElementById(self.detail_id);
        Show_Color_detail_canvas.style.display = "none";
    };

    /**
     * 渐变调色板 鼠标在调色板中移动操作 更新详情界面信息
     * @param event
     */
    var gradient_canvasMouseMove = function (event) {
        //计算title详情
        var canvas = document.getElementById(self.gradient_canvas_id);
        var m_MaxWidth = canvas.width;
        canvas.title = gradient_Min + parseInt((gradient_Max - gradient_Min) / m_MaxWidth * event.clientX);
        canvas.style.cursor = "crosshair";

        //获取鼠标当前点
        var context = canvas.getContext("2d");
        var imagedata = context.getImageData(event.clientX, event.clientY, 1, 1);
        var m_rgb = "rgb(" + imagedata.data[0] + "," + imagedata.data[1] + "," + imagedata.data[2] + ")";
        //详情中canvas 颜色 显示部分
        var Show_Color_detail_canvas = document.getElementById(self.detail_canvas_id);
        Show_Color_detail_canvas.style.background = m_rgb;
        //详情中文字部分
        var Show_Color_detail_a = document.getElementById(self.detail_a_id);
        Show_Color_detail_a.innerHTML = 220 + parseInt((340 - 220) / m_MaxWidth * event.clientX);
    };


    /**
     *根据json中 渐变调色板的内容，解析
     */
    var init_gradient_canvas = function () {
        var canvas = document.getElementById(self.gradient_canvas_id);
        var m_MaxWidth = canvas.width;
        var m_MaxHeight = canvas.height;
        var ctx = canvas.getContext('2d');
        var grd = ctx.createLinearGradient(0, 0, m_MaxWidth, 0);
        //循环添加
        if (gradient_Num > 1) {
            for (var i = 0; i < gradient_Num; i++) {
                var gradient_data_i = gradient_data[i][1];
                var RGB_I = "rgb(" + gradient_data_i[0] + ", " + gradient_data_i[1] + ", " + gradient_data_i[2] + ")";
                grd.addColorStop(1 / (gradient_Num - 1) * i, RGB_I);
            }
        } else {
            var gradient_data_i = gradient_data[0][1];
            var RGB_I = "rgb(" + gradient_data_i[0] + ", " + gradient_data_i[1] + ", " + gradient_data_i[2] + ")";
            grd.addColorStop(0, RGB_I);
            grd.addColorStop(1, RGB_I);
        }
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, m_MaxWidth, m_MaxHeight);
    };

    /**
     * 初始化详情 div 返回 html
     * @returns {string}
     */
    var init_detail = function () {
        self.detail_id = self.target_div_ID + "_detail";
        self.detail_canvas_id = self.target_div_ID + "_detail_canvas";
        self.detail_a_id = self.target_div_ID + "_detail_a";
        //详情部分初始化不显示
        var m_inner = ' <!--悬浮显示部分DIV -->'
            + '<div id="' + self.detail_id + '"'
            + 'style="width: 120px;height: 30px;margin-left: 295px; margin-top:-40px;float: left; border: 1px solid #7d7d7d;'
            + 'display:none;">'
            + '<canvas style="width: 22px;height: 22px; float: left;background-color: #ffce27;margin: 4px;"'
            + 'id="' + self.detail_canvas_id + '">'
            + '</canvas>'
            + '<a id="' + self.detail_a_id + '" style="height: 30px;line-height: 30px;">200 - 230</a>'
            + '</div>';
        return m_inner;
    };
};


