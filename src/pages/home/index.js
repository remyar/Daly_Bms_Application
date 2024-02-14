import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { withNavigation } from '../../providers/navigation';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import actions from '../../actions';
import Infos from '../../components/infos';
import Graph from '../../components/graph';

let state = 0;

function HomePage(props) {

    const colours = [
        '#55a1ea', '#33628f', '#55a1ea', '#33628f',
        '#55a1ea', '#33628f', '#55a1ea', '#33628f',
        '#55a1ea', '#33628f', '#55a1ea', '#33628f',
        '#55a1ea', '#33628f', '#55a1ea', '#33628f',
    ];


    const [packMeasurements, setPackMeasurements] = useState({});
    const [minMaxCellVoltage, setMinMaxCellVoltage] = useState({});
    const [statusInfos, setStatusInfos] = useState({});
    const [cellsVoltages, setCellsVoltages] = useState({});
    const [packTemps, setpackTemps] = useState({});

    async function process() {
        let flag = false;
        let nbCells = 0;
        let inter = setInterval(async () => {
            if (flag == false) {
                flag = true;
                try {
                    let result = undefined;
                    if (state == 0) {
                        result = await props.dispatch(actions.serial.getpackMeasurements());
                        setPackMeasurements(result.packMeasurements);
                    }
                    if (state == 1) {
                        result = await props.dispatch(actions.serial.getMinMaxCellVoltage());
                        setMinMaxCellVoltage(result.minMaxCellVoltage);
                    }
                    if (state == 2) {
                        result = await props.dispatch(actions.serial.getStatusInfos());
                        nbCells = result.statusInfos?.numberOfCells || 1;
                        setStatusInfos(result.statusInfos);
                    }
                    if (state == 3) {
                        result = await props.dispatch(actions.serial.getCellsVoltages(nbCells));
                        setCellsVoltages(result.cellsVoltages);
                    }
                    if (state == 4) {
                        result = await props.dispatch(actions.serial.getPackTemp());
                        setpackTemps(result.packTemps);
                    }
                    state++;
                    if (state > 4) {
                        state = 0;
                    }
                } catch (err) {
                    console.log(err);
                }
                flag = false;
            }
        }, 500)
    }

    useEffect(() => {
        process();
    }, []);

    let minVoltage = 2.9;
    let maxVoltage = 4.3;

    let voltages = [];
    let voltagesmin = [];
    let voltagesmax = [];

    let infosTab = []; 
    let tempext = [];
    let labels = [];

    let markLineData = [];

    infosTab.push(
        <div id={"range0"} className="stat">
            <span className="x t">Range :</span>
            <span className="x v">{minMaxCellVoltage?.cellDiff + " mV"}</span>
        </div>);

    infosTab.push(
        <div id={"voltage0"} className="stat">
            <span className="x t">Voltage :</span>
            <span className="x v">{packMeasurements?.packVoltage?.toFixed(2) + " V"}</span>
        </div>);

    infosTab.push(
        <div id={"voltage0"} className="stat">
            <span className="x t">State Of Charge :</span>
            <span className="x v">{packMeasurements?.packSOC?.toFixed(2) + " %"}</span>
        </div>);

    markLineData.push({ name: 'avg', type: 'average', lineStyle: { color: '#ddd', width: 2, type: 'dotted', opacity: 0.3 }, label: { distance: [10, 0], position: 'start', color: "#eeeeee", textBorderColor: '#313131', textBorderWidth: 2 } });
    markLineData.push({ name: 'min', type: 'min', lineStyle: { color: '#ddd', width: 2, type: 'dotted', opacity: 0.3 }, label: { distance: [10, 0], position: 'start', color: "#eeeeee", textBorderColor: '#313131', textBorderWidth: 2 } });
    markLineData.push({ name: 'max', type: 'max', lineStyle: { color: '#ddd', width: 2, type: 'dotted', opacity: 0.3 }, label: { distance: [10, 0], position: 'start', color: "#eeeeee", textBorderColor: '#313131', textBorderWidth: 2 } });


    for (let j = 0; j < ((statusInfos?.numberOfCells) || 1); j++) {
        labels.push(0 + "/" + (j + 1));

        // Make different banks different colours (stripes)
        let stdcolor = colours[1];

        // Red
        let color = stdcolor;
        var v = (parseFloat((cellsVoltages?.cellVmV && cellsVoltages?.cellVmV[j]) || 0) / 1000.0);
       /* if (voltagesmax[j] == undefined){
            voltagesmax[j] = minVoltage;
        }
        if (voltagesmin[j] == undefined) {
            voltagesmin[j] = maxVoltage;
        }
        if (voltagesmin[j] > v){
            voltagesmin[j] = v;
        }
        if (voltagesmax[j] < v) {
            voltagesmax[j] = v;
        }*/


        voltages.push({ value: v, itemStyle: { color: color } });
    }

    return <div>


        <Infos infosTab={infosTab} />

        <div className="graphs">
            <Graph id={"graph0"}
                markLine={markLineData}
                xAxis={{ data: labels }}
                yAxis={[{ gridIndex: 0, min: minVoltage, max: maxVoltage }]}
                series={[{ name: 'Voltage', data: voltages }
                    , { name: 'Min V', data: voltagesmin }
                    , { name: 'Max V', data: voltagesmax }
                    , { name: 'CellTemperature', data: tempext }]}

            />
        </div>

    </div >

}

export default withStoreProvider(withSnackBar(withNavigation(injectIntl(HomePage))));