function imaradArea(form, str) {
    // 新增时候默认设置地点
    if (!str || str.indexOf('_') < 0) {
        str = "0_0_0_0"
    }
    var areaArray = str.split('_');

    // 省份的回显
    $.each(province, function (k, p) {
        if (p.ProID == areaArray[0]) {
            var option = "<option selected = 'selected' value='" + p.ProID + "'>" + p.ProName + "</option>";
        } else {
            var option = "<option value='" + p.ProID + "'>" + p.ProName + "</option>";
        }
        $("#selProvince").append(option);
    });

    // 城市的回显
    $.each(city, function (k, p) {
        if (p.ProID == areaArray[0]) {
            if (p.CityID == areaArray[1]) {
                var option = "<option selected = 'selected' value='" + p.CityID + "'>" + p.CityName + "</option>";
            } else {
                var option = "<option value='" + p.CityID + "'>" + p.CityName + "</option>";
            }
            $("#selCity").append(option);
        }
    });

    // 区县的回显
    $.each(District, function (k, p) {
        if (p.CityID == areaArray[1]) {
            if (p.Id == areaArray[2]) {
                var option = "<option selected = 'selected' value='" + p.Id + "'>" + p.DisName + "</option>";
            } else {
                var option = "<option value='" + p.Id + "'>" + p.DisName + "</option>";
            }
            $("#selDistrict").append(option);
        }
    });

    // 城市根据省份联动
    form.on('select(pro)', function (data) {
        $("#selCity option").not('.no-del').remove();
        $("#selDistrict option:gt(0)").remove();
        form.render('select');
        $.each(city, function (k, p) {
            if (p.ProID == data.value) {
                var option = "<option value='" + p.CityID + "'>" + p.CityName + "</option>";
                $("#selCity").append(option);
            }
        });
        form.render();
    });

    // 区县根据城市联动
    form.on('select(city)', function (data) {
        $("#selDistrict option:gt(0)").remove();
        $.each(District, function (k, p) {
            if (p.CityID == data.value) {
                var option = "<option value='" + p.Id + "'>" + p.DisName + "</option>";
                $("#selDistrict").append(option);
            }
        });
        form.render();
    });
    form.render();
}
