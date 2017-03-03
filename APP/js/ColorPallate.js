/**
 * Created by lenovo on 2017/3/1.
 */


var ColorPallate = function () {
    var self = this;
    //总体DIV
    this.target_div = "";
    //总体ID值
    this.target_div_ID = "";
    //渐变div 的ID

    //详情显示DIV

    self.m_BeginJson = {};
    //初始化json
    this.init_palette = function (m_DivID, m_Json) {

        self.target_div_ID = m_DivID;
        self.target_div = document.getElementById(m_DivID);
        //解析 m_Json
        self.m_BeginJson = m_Json;
        //根据json 判断显示模式
        GetShowMode();
        //根据显示模式 初始化
        init_div();
    };

    var single_Exist = false;
    var gradient_Exist = false;
    var single_data = [];
    var gradient_data = [];
    var single_Num = 0;
    var gradient_Num = 0;
    var gradient_Min = 0;
    var gradient_Max = 0;

    /**
     * 解析json文件
     * @constructor
     */
    var GetShowMode = function () {
        if (self.m_BeginJson.single != undefined) {
            single_data = self.m_BeginJson.single;
            //解析single
            single_Num = single_data.length;
            if (single_Num > 0) {
                single_Exist = true;
            }
        }
        if (self.m_BeginJson.gradient != undefined) {
            gradient_data = self.m_BeginJson.gradient;
            //解析gradient
            gradient_Num = gradient_data.length;
            if (gradient_Num > 0) {
                gradient_Exist = true;
            }
            gradient_Min = gradient_data[0][0];
            gradient_Max = gradient_data[gradient_Num - 1][0];
        }
    };

    /**
     * 初始化整体DIV显示
     */
    var init_div = function () {
        //通过主DIV 设置
        var m_SingleHtml = init_single();
        var m_gradientHtml = init_gradient();
        var m_detailHtml = init_detail();
        var TotalInner = m_SingleHtml + m_gradientHtml + m_detailHtml;
        //内容赋值
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
        //onmouseover='canvasMouseOver(event)' onmousemove='canvasMouseMove(event)' onclick='GetColor(event)'
        var m_Canvas = document.getElementById(self.gradient_canvas_id);
        //m_Canvas.onmouseover = gradient_canvasMouseOver;
        m_Canvas.onmousemove = gradient_canvasMouseMove;
        m_Canvas.onclick = gradient_canvasClickGetColor;
    };

    var gradient_canvasMouseMove = function (event) {
        //计算title详情
        var canvas = document.getElementById(self.gradient_canvas_id);
        var m_MaxWidth = canvas.width;
        canvas.title = gradient_Min + parseInt((gradient_Max - gradient_Min) / m_MaxWidth * event.clientX);
        canvas.style.cursor = "crosshair";
    };

    var gradient_canvasClickGetColor = function () {

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
        /*      grd.addColorStop(0, "rgb(120, 155, 242)");
         grd.addColorStop(1 / 12, "rgb(176, 224, 230)");
         grd.addColorStop(1 / 12 * 2, "rgb(32, 178, 170)");
         grd.addColorStop(1 / 12 * 3, "rgb(154, 205, 50)");
         grd.addColorStop(1 / 12 * 4, "rgb(46, 139, 87)");
         grd.addColorStop(1 / 12 * 5, "rgb(245, 250, 190)");
         grd.addColorStop(1 / 12 * 6, "rgb(222, 184, 135)");
         grd.addColorStop(1 / 12 * 7, "rgb(255, 255, 0)");
         grd.addColorStop(1 / 12 * 8, "rgb(255, 165, 0)");
         grd.addColorStop(1 / 12 * 9, "rgb(255, 69, 0)");
         grd.addColorStop(1 / 12 * 10, "rgb(178, 34, 34)");
         grd.addColorStop(1 / 12 * 11, "rgb(255, 182, 193)");
         grd.addColorStop(1, "rgb(255, 20, 147)");*/
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, m_MaxWidth, m_MaxHeight);
    };
    //初始化详情列表
    var init_detail = function () {
        var m_inner = "";
        return m_inner;
    };
};


