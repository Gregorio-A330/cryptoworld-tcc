import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";

const Block = (props) => {
    return (
        <Grid item xs={12} style={{border: '2px solid black', padding: '12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '7rem', backgroundColor: '#c4c4c4', borderRadius: '5px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{fontWeight: 'bold'}}>{props.coinData.name}</span>
                <Link to={`/coin/${props.coinData.iso}`} style={{ color: 'black'}}><i className="fa fa-plus"></i></Link>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                <span style={{fontSize: '0.9em'}}>${(Math.round((props.coinData.ohlc.o * props.exchangeRate) * 100) / 100)}</span>
                <span style={{fontSize: '0.9em'}}>${(Math.round((props.coinData.ohlc.l * props.exchangeRate) * 100) / 100)}</span>
                <span style={{fontSize: '0.9em'}}>${(Math.round((props.coinData.ohlc.h * props.exchangeRate) * 100) / 100)}</span>
                <span style={{fontSize: '0.9em'}}>${(Math.round((props.coinData.ohlc.c * props.exchangeRate) * 100) / 100)}</span>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                <span>24h open</span>
                <span>24h high</span>
                <span>24h low</span>
                <span>Change</span>
            </div>
        </Grid>
    )
}

export default Block