'use client';

import { useState } from 'react';
import Toggle from '../../../components/form/toggle';
import { HFlex, VFlex } from '../../../components/layout/wrapper/flex';
import { useToast } from '../../../hooks/usetoasts';
import styles from './page.module.scss'
import TextInput from '../../../components/form/textinput';
import Button from '../../../components/form/button';
import { motion } from 'framer-motion';
import DoughnutChart from '../../../components/charts/doughnut';
import numWithCommas from '../../../methods/number_with_commas';
import Icon from '../../../components/icon';
import Badge from '../../../components/design/badge';

interface CalculatorParams {
    cost?: string;
    price?: string;
    commission?: string;
    courier?: string;
    packaging?: string;
    roas?: string;
}

interface CalcResult {
    price?: number;
    cost?: number;
    costRate?: number;
    commission?: number;
    commissionRate?: number;
    courier?: number;
    courierRate?: number;
    packaging?: number;
    packagingRate?: number;
    roas?: number;
    cps?: number;
    cpsRate?: number;
    margin?: number;
    marginRate?: number;
    [key: string]: number | undefined;
}

export default function Calculator() {

    const { addToast } = useToast();

    const [simpleMode, setSimpleMode] = useState<boolean>(true);
    const [freeShipping, setFreeShipping] = useState<boolean>(true);
    const [isCoupang, setIsCoupang] = useState<boolean>(true);

    const [params, setParams] = useState<CalculatorParams>({
        cost: '',
        price: '',
        commission: '',
        courier: '',
        packaging: '',
        roas: ''
    } as CalculatorParams);

    const [result, setResult] = useState<CalcResult | null>(null);
    const [results, setResults] = useState<CalcResult[]>([]);

    const calculate = (save: boolean) => {

        let cParams: { [key: string]: string | number } = {}

        if (simpleMode) {
            cParams = { ...params, commission: isCoupang ? 8.58 : 4.50, courier: freeShipping ? 2300 : 0, packaging: 150, roas: '' };
        } else {
            cParams = { ...params };
        }

        for (const [key, value] of Object.entries(cParams)) {
            if (value.toString() == '' && key != 'roas') {
                addToast({ message: '값을 입력해주세요.', type: 'error' });
                return;
            } else {
                cParams[key] = Number(value);
            }
        }

        const cps: number = cParams.roas ? 100 * (cParams.price as number) / (cParams.roas as number) : 0
        const commission: number = (cParams.commission as number) * (cParams.price as number) / 100
        let result: CalcResult = {
            cost: cParams.cost as number,
            price: cParams.price as number,
            commission: commission,
            commissionRate: cParams.commission as number,
            courier: cParams.courier as number,
            packaging: cParams.packaging as number,
            roas: cParams.roas as number,
            cps: cps,
            margin: (cParams.price as number) - (cParams.cost as number) - commission - (cParams.courier as number) - (cParams.packaging as number) - cps,
        }

        for (const [key, val] of Object.entries(result)) {
            if (key == 'roas' || key == 'commissionRate') continue;
            result[key] = Math.round(val!);
        }

        result.costRate = parseFloat((100 * (result.cost! / result.price!)).toFixed(2));
        result.courierRate = parseFloat((100 * (result.courier! / result.price!)).toFixed(2));
        result.packagingRate = parseFloat((100 * (result.packaging! / result.price!)).toFixed(2));
        result.cpsRate = parseFloat((100 * (result.cps! / result.price!)).toFixed(2));
        result.marginRate = parseFloat((100 * (result.margin! / result.price!)).toFixed(2));

        setResult(result);

        if (save) {
            addToast({ message: '저장됨', type: 'success' });
            setResults([...results, result]);
        } else {
            addToast({ message: '계산완료', type: 'info' });
        }
    }

    const getChartData = () => {
        if (result == null) return [];

        const marginIsPositive = result.margin! > 0;

        let cost = { label: '원가', value: result.cost!, color: '#CB3333' };
        let commission = { label: '수수료', value: result.commission!, color: '#EFC931' };
        let courier = { label: '배송비', value: result.courier!, color: '#17B13D' };
        let packaging = { label: '포장비', value: result.packaging!, color: '#E39632' };
        let cps = { label: '광고비', value: result.cps!, color: '#12B486' };
        let margin = { label: '마진', value: marginIsPositive ? result.margin! : 0, color: '#275EA5' };

        return [cost, commission, courier, packaging, cps, margin];
    }

    const showOnSimple = {
        height: simpleMode ? 'auto' : '0px',
        opacity: simpleMode ? 1 : 0,
    }

    const showOnDetail = {
        height: simpleMode ? '0px' : 'auto',
        opacity: simpleMode ? 0 : 1,
    }

    const disablePointerActionInSimpleMode = {
        pointerEvents: simpleMode ? 'none' : 'auto',
    } as React.CSSProperties

    const disablePointerActionInDetailMode = {
        pointerEvents: simpleMode ? 'auto' : 'none',
    } as React.CSSProperties

    return (
        <div className={styles.calcWrap}>
            <section className={styles.left}>
                <VFlex className={styles.calculator}>
                    <Toggle option1='간단 계산' option2='상세 설정' displayLabel={true} onChange={() => setSimpleMode(!simpleMode)} firstOptionSelected={simpleMode} />
                    <motion.div initial={{ height: '0px', opacity: 0 }} animate={{ height: result == null ? '0px' : 'auto', opacity: result == null ? 0 : 1 }} className={styles.chart_wrapper}>
                        <DoughnutChart
                            title=' '
                            data={getChartData()}
                        />
                        <VFlex align='center' justify='center' gap={4}>
                            <h3>{result && result.marginRate}%</h3>
                            <h2>{result && numWithCommas(result.margin!)}원</h2>
                        </VFlex>
                    </motion.div>
                    <div className={styles.calculatorForm}>
                        <TextInput name='cost' value={params.cost!} onChange={(value) => setParams({ ...params, cost: value })} label='상품원가' placeholder='800' unit='원' onEnter={() => calculate(true)} />
                        <TextInput name='price' value={params.price!} onChange={(value) => setParams({ ...params, price: value })} label='판매가' placeholder='7900' unit='원' onEnter={() => calculate(true)} />
                        <motion.div animate={showOnDetail} className={styles.motion_div} style={disablePointerActionInSimpleMode}>
                            <TextInput canTabToFocus={!simpleMode} name='commission' value={params.commission!} onChange={(value) => setParams({ ...params, commission: value })} label='수수료' placeholder='8.60' unit='%' onEnter={() => calculate(true)} />
                        </motion.div>
                        <motion.div animate={showOnSimple} className={styles.motion_div} style={disablePointerActionInDetailMode}>
                            <Toggle big option1='무료배송' option2='유료배송' displayLabel={true} onChange={() => setFreeShipping(!freeShipping)} firstOptionSelected={freeShipping} />
                        </motion.div>
                        <motion.div animate={showOnDetail} className={styles.motion_div} style={disablePointerActionInSimpleMode}>
                            <TextInput canTabToFocus={!simpleMode} name='courier' value={params.courier!} onChange={(value) => setParams({ ...params, courier: value })} label='택배비' placeholder='2300' unit='원' onEnter={() => calculate(true)} />
                        </motion.div>
                        <motion.div animate={showOnSimple} className={styles.motion_div} style={disablePointerActionInDetailMode}>
                            <Toggle big option1='쿠팡' option2='네이버' displayLabel={true} onChange={() => setIsCoupang(!isCoupang)} firstOptionSelected={isCoupang} />
                        </motion.div>
                        <motion.div animate={showOnDetail} className={styles.motion_div} style={disablePointerActionInSimpleMode}>
                            <TextInput canTabToFocus={!simpleMode} name='packaging' value={params.packaging!} onChange={(value) => setParams({ ...params, packaging: value })} label='포장비' placeholder='150' unit='원' onEnter={() => calculate(true)} />
                        </motion.div>
                        <motion.div animate={showOnDetail} className={styles.motion_div} style={disablePointerActionInSimpleMode}>
                            <TextInput canTabToFocus={!simpleMode} name='roas' value={params.roas!} onChange={(value) => setParams({ ...params, roas: value })} label='ROAS' placeholder='300' unit='%' onEnter={() => calculate(true)} />
                        </motion.div>
                    </div>
                    <HFlex align='center' justify='center' gap={10}>
                        <Button text='계산' type='light' onClick={() => calculate(false)} />
                        <Button text='저장' type='primary' onClick={() => calculate(true)} />
                    </HFlex>
                </VFlex>
            </section>
            <section className={styles.right}>
                <div>
                    <ResultTableToolbar onReset={() => setResults([])} onCopy={() => { }} onDownload={() => { }} />
                    <ResultsTable results={results} />
                </div>
            </section>
        </div>
    )
}

function ResultsTable({
    results
}: {
    results: CalcResult[]
}) {

    const columnsData = [
        { label: '판매가', key: 'price' },
        { label: '마진', key: 'margin' },
        { label: '마진(%)', key: 'marginRate' },
        { label: '원가', key: 'cost' },
        { label: '원가(%)', key: 'costRate' },
        { label: '수수료', key: 'commission' },
        { label: '수수료(%)', key: 'commissionRate' },
        { label: '배송비', key: 'courier' },
        { label: '배송비(%)', key: 'courierRate' },
        { label: '포장비', key: 'packaging' },
        { label: '포장비(%)', key: 'packagingRate' },
        { label: 'ROAS', key: 'roas' },
        { label: '광고비', key: 'cps' },
        { label: '광고비(%)', key: 'cpsRate' },
    ]

    return (
        <table className={styles.results_table}>
            <thead>
                <tr>
                    {
                        columnsData.map((col, i) => {
                            return (<>
                                {col.label == '배송비' && <th key='delivery_type'>배송타입</th>}
                                <th key={col.key}>{col.label}</th>
                            </>)
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    results.length > 0 && results.map((result, i) => <ResultTableRow key={i} result={result} colData={columnsData} />)
                }
                {
                    results.length == 0 && <ResultTableEmpty />
                }
            </tbody>
        </table>
    )
}

function ResultTableRow({ result, colData }: { result: CalcResult, colData: { label: string, key: string }[] }) {

    return (
        <motion.tr initial={{ height: '0px', opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
            {
                colData.map((col, i) => {
                    const val = result[col.key];
                    return <>
                        {col.label == '배송비' && <td key='deliveryType'><DeliverTypeBadge free={val != 0} /></td>}
                        <td key={col.key}>
                            {col.key == 'marginRate' && (val! < 0 || val! > 40) && <span className={`${val! < 0 ? styles.minus : ''} ${styles.marginIndicator}`}></span>}
                            {numWithCommas(val)}
                        </td>
                    </>
                })
            }
        </motion.tr>
    )
}

function DeliverTypeBadge({
    free
}: { free: boolean }) {
    return <Badge type={free ? 'success' : 'warning'} text={free ? '무료배송' : '유료배송'} />
}

function ResultTableEmpty() {
    return (
        <tr className={styles.empty_table}>
            <td>계산 내역이 없습니다.</td>
        </tr>
    )
}

function ResultTableToolbar({
    onReset,
    onCopy,
    onDownload,
}: {
    onReset: () => void;
    onCopy: () => void;
    onDownload: () => void;
}) {
    return (
        <HFlex align='center' justify='space-between' className={styles.table_toolbar}>
            <span>계산 내역</span>
            <div className={styles.buttons}>
                <button className={styles.reset_button} onClick={onReset}>
                    <Icon icon='reset' size={20} alt={'reset'} />
                </button>
                <Button onClick={onCopy} text='복사' type='primary' />
                <Button onClick={onDownload} text='엑셀' type='dark' />
            </div>
        </HFlex>
    )
}