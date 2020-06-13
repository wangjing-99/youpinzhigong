<template>
  <view :style="isDialog?'display:block':'display:none'">
    <view class="add-address">
      <view class="region-select">
        <view class="hd">
          <view class="region-selected">
            <view :class="['item', { disabled: item.area_id == 0, selected: (regionType -1) === index }]"
                  @click="selectRegionType" :data-region-type-index="index" v-for="(item, index) of selectRegionList"
                  :key="item.area_id">
              {{item.area_name}}
            </view>
          </view>
          <view :class="selectRegionDone ? 'done' : 'disabled done'" @click="doneSelectRegion">确定</view>
        </view>
        <view class="bd">
          <view class="region-list">
            <view :class="item.selected ? 'selected item' : 'item'" @click="selectRegion" :data-region-index="index"
                  v-for="(item, index) of regionList" :key="item.area_id">{{item.area_name}}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bg-mask" @click.stop="cancelSelectRegion"></view>
  </view>
</template>

<script>
  import api from '@/utils/api'
  // import util from '@/utils/util'
  export default {
    props: {
      isDialog: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        selectRegionList: [
          {area_id: 0, area_name: '省份', parent_id: 0, level: 1},
          {area_id: 0, area_name: '城市', parent_id: 0, level: 2},
          {area_id: 0, area_name: '区县', parent_id: 0, level: 3}
        ],
        regionType: 1,
        regionList: [],
        selectRegionDone: false
      }
    },
    mounted() {
      this.chooseRegion()
    },
    onShow() {
      this.chooseRegion()
    },
    methods: {
      // 获得对应级别的地市信息
      async getRegionList(regionId) {
        let regionType = this.regionType;
        const res = await api.getXcxAddress({
          id: regionId,
          level: regionType
        })
        // const res = await api.getRegionList({parentId: regionId});
        // console.log('地市信息,请求结果', res);
        if (res.code === 0) {
          this.regionList = res.data.map(item => {
            // 找到已选择的
            if (regionType === parseInt(item.level) && this.selectRegionList[regionType - 1].area_id === item.area_id) {
              item.selected = true;
            } else {
              item.selected = false;
            }
            return item;
          })
        }
      },
      // 计算3级地市是否都已选好
      setRegionDoneStatus() {
        let doneStatus = this.selectRegionList.every(item => {
          return item.area_id !== 0
        });
        this.selectRegionDone = doneStatus
      },
      // 展开地市选择浮窗
      chooseRegion() {
        // 设置区域选择数据
        this.getRegionList(0)
        this.regionType = 1
        this.setRegionDoneStatus()
      },
      // 选择不同级别的地市信息
      selectRegionType(event) {
        let regionTypeIndex = event.target.dataset.regionTypeIndex;
        let selectRegionList = this.selectRegionList;
        // 判断是否可点击
        if (regionTypeIndex + 1 === this.regionType || (regionTypeIndex - 1 >= 0 && parseInt(selectRegionList[regionTypeIndex - 1].area_id) <= 0)) {
          return false;
        }
        this.regionType = regionTypeIndex + 1;
        let selectRegionItem = selectRegionList[regionTypeIndex];
        this.getRegionList(selectRegionItem.parent_id);
        this.setRegionDoneStatus();
      },
      // 点击某一个地市名字
      selectRegion(event) {
        let regionIndex = event.target.dataset.regionIndex;
        let regionItem = this.regionList[regionIndex];
        let regionType = parseInt(regionItem.level)
        let selectRegionList = this.selectRegionList;
        selectRegionList[regionType - 1] = regionItem;
        if (regionType !== 3) {
          this.selectRegionList = selectRegionList;
          this.regionType = regionType + 1;
          this.getRegionList(regionItem.area_id)
        } else {
          this.selectRegionList = selectRegionList;
        }
        // 重置下级区域为空
        selectRegionList.map((item, index) => {
          if (index > regionType - 1) {
            item.area_id = 0;
            item.area_name = index === 1 ? '城市' : '区县';
            item.parent_id = 0;
          }
          return item;
        });
        this.selectRegionList = selectRegionList;
        this.regionList = this.regionList.map(item => {
          // 找到已选择的
          if (this.regionType === parseInt(item.level) && parseInt(this.selectRegionList[this.regionType - 1].area_id) === parseInt(item.area_id)) {
            item.selected = true;
          } else {
            item.selected = false;
          }
          return item;
        })
        this.setRegionDoneStatus();
      },
      // 点击浮窗的确定
      doneSelectRegion() {
        if (this.selectRegionDone === false) {
          return false;
        }
        const fullRegion = this.selectRegionList.map(item => {
          return item.area_name
        }).join('')
        const areaIds = this.selectRegionList.map(item => {
          return parseInt(item.area_id)
        }).join(',')
        this.$emit('completeRegion', {
          fullRegion: fullRegion,
          areaIds: areaIds
        })
      },
      // 点击浮窗的背景遮罩，取消地市选择
      cancelSelectRegion() {
        this.$emit('completeRegion', false)
        this.regionType = this.regionDoneStatus ? 3 : 1
      }
    },
    onUnload() {
      this.selectRegionList = [
        {area_id: 0, area_name: '省份', parent_id: 0, level: 1},
        {area_id: 0, area_name: '城市', parent_id: 0, level: 2},
        {area_id: 0, area_name: '区县', parent_id: 0, level: 3}
      ]
      this.regionType = 1
      this.regionList = []
      this.selectRegionDone = false
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../static/css/base";

  .region-select {
    width: 100%;
    height: 300px;
    background: #fff;
    position: fixed;
    z-index: 10;
    left: 0;
    bottom: 0;
  }

  .region-select .hd {
    height: 35px;
    width: 92%;
    border-bottom: .5px solid #f4f4f4;
    padding: 10px 15px 0 15px;
    font-size: @font_size_30;
  }

  .region-select .region-selected {
    float: left;
    height: 30px;
    display: flex;
  }

  .region-select .region-selected .item {
    max-width: 70px;
    margin-right: 15px;
    text-align: left;
    line-height: 30px;
    height: 100%;
    color: #333;
    font-size: @font_size_28;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .region-select .region-selected .item.disabled {
    color: #999;
  }

  .region-select .region-selected .item.selected {
    color: #b4282d;
  }

  .region-select .done {
    float: right;
    height: 30px;
    width: 30px;
    border: none;
    background: #fff;
    line-height: 30px;
    text-align: center;
    color: #333;
    font-size: @font_size_28;
  }

  .region-select .done.disabled {
    color: #999;
  }

  .region-select .bd {
    height: 246px;
    width: 100%;
    padding: 0 15px;
    overflow-y: auto;
  }

  .region-select .region-list {
    height: auto;
    overflow: scroll;

  }

  .region-select .region-list .item {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: left;
    color: #333;
    font-size: @font_size_28;
  }

  .region-select .region-list .item.selected {
    color: #b4282d;
  }

  .bg-mask {
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 8;
  }

</style>
