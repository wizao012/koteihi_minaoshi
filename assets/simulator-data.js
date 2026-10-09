/* 2026-10 usage / 2026-11 billing. ANN 2026-09-29 standard-household models.
   https://www.home-tv.co.jp/news/content/?news_id=000536628
   These are published reference figures, not a customer's tariff calculation. */
(function(root){
const electricity = {
 hokkaido:{name:'北海道電力',current:10552,increase:1286},
 tohoku:{name:'東北電力',current:9690,increase:1486},
 tokyo:{name:'東京電力',current:9561,increase:1286},
 chubu:{name:'中部電力',current:9647,increase:1492},
 hokuriku:{name:'北陸電力',current:7970,increase:835},
 kansai:{name:'関西電力',current:8251,increase:1318},
 chugoku:{name:'中国電力',current:9158,increase:1326},
 shikoku:{name:'四国電力',current:9372,increase:1412},
 kyushu:{name:'九州電力',current:8115,increase:1239},
 okinawa:{name:'沖縄電力',current:10752,increase:1578}
};
const gas={tokyo:{name:'東京ガス',current:6488,increase:744},osaka:{name:'大阪ガス',current:6902,increase:572},toho:{name:'東邦ガス',current:7118,increase:553},saibu:{name:'西部ガス',current:6932,increase:435}};
const prefectures = [
 ['北海道','hokkaido'],['青森県','tohoku'],['岩手県','tohoku'],['宮城県','tohoku'],['秋田県','tohoku'],['山形県','tohoku'],['福島県','tohoku'],
 ['茨城県','tokyo'],['栃木県','tokyo'],['群馬県','tokyo'],['埼玉県','tokyo'],['千葉県','tokyo'],['東京都','tokyo'],['神奈川県','tokyo'],
 ['新潟県','tohoku'],['富山県','hokuriku'],['石川県','hokuriku'],['福井県','hokuriku,kansai'],['山梨県','tokyo'],['長野県','chubu'],['岐阜県','chubu,hokuriku,kansai'],['静岡県','tokyo,chubu'],['愛知県','chubu'],['三重県','chubu,kansai'],
 ['滋賀県','kansai'],['京都府','kansai'],['大阪府','kansai'],['兵庫県','kansai,chugoku'],['奈良県','kansai'],['和歌山県','kansai'],
 ['鳥取県','chugoku'],['島根県','chugoku'],['岡山県','chugoku'],['広島県','chugoku'],['山口県','chugoku'],
 ['徳島県','shikoku'],['香川県','shikoku'],['愛媛県','shikoku'],['高知県','shikoku'],
 ['福岡県','kyushu'],['佐賀県','kyushu'],['長崎県','kyushu'],['熊本県','kyushu'],['大分県','kyushu'],['宮崎県','kyushu'],['鹿児島県','kyushu'],['沖縄県','okinawa']
];
const notes={
 '静岡県':'富士川を境に東京・中部エリアに分かれます。分からない場合は候補の幅を表示します。',
 '福井県':'主に嶺北は北陸、三方郡美浜町以西は関西エリアです。',
 '岐阜県':'主に中部。一部に北陸・関西エリアがあります。',
 '三重県':'主に中部。熊野市・南牟婁郡などは関西エリアです。',
 '兵庫県':'主に関西。赤穂市福浦は中国エリアです。'
};
function calculate(prefecture,area,gasKey){
 const pref=prefectures.find(p=>p[0]===prefecture);
 if(!pref)throw new Error('都道府県を選択してください。');
 if(area && !electricity[area])throw new Error('電力エリアを選び直してください。');
 if(gasKey && !gas[gasKey] && !['other','lpg','none'].includes(gasKey))throw new Error('ガス会社を選び直してください。');
 const ids=area?[area]:pref[1].split(',');
 return {prefecture,electricity:ids.map(id=>({id,...electricity[id],previous:electricity[id].current-electricity[id].increase})),gas:gas[gasKey]?{...gas[gasKey],previous:gas[gasKey].current-gas[gasKey].increase}:null,gasKey};
}
const data={electricity,gas,prefectures,notes,calculate};
if(typeof module!=='undefined'&&module.exports)module.exports=data;
else root.RateSimulator=data;
})(typeof window!=='undefined'?window:globalThis);
