const fs = require("fs");
const mic = require("mic");
const record = require("node-record-lpcm16");

const AVSApi = require("../dist").AVSApi;

// var micInstance = mic({
//     rate: "16000",
//     channels: "1",
//     debug: true,
//     exitOnSilence: 6,
// });

// micInstance.start();

const stream = record.record({
    verbose: true,
    silence: "2.0",
    threshold: 0.5,
    endOnSilence: true,
    sampleRate: 16000,
    channels: 1,
    recorder:'rec'
}).stream().pause();

const avs = new AVSApi(stream, undefined, {
    clientId: "amzn1.application-oa2-client.7ecd6453dc8d4fe39918f5f12a3776f5",
    clientSecret: "69168ffbd7bed063e82e68e085f73a9c24e9f2fdf330ae97ba8739f695fd082e",
    refreshToken: "Atzr|IwEBIG5I22Ah7DGDmPtJtYd2c-Hk9c4OwR5Qj_lvbNY5Ky_s4tdJf99Rp2saa5r12ulULewZ_gqFUXsN0NaLJ3JijIqTRpK7BErDBh9QJ83ASqHT1NbBmAE1y5aZUdKfM0n7opmuMhoKx3Q1nQwsQC-J7DasrVp7CIdZcTytC_teC_dFGThHoPY_JsjwVPS7NuC40sSebwFILGr87pxijN0pqIpmETh0msqMWLDwS0hpzgbWojQJjbbEdMbvIC9gv2GP3LEIiY3ANQpc-fuILWy7-ZHEdwWNnLdP_7-02xFW3OuIpO91W69l2Dx5TYhJ1mcR0Kl-sqOKip0MCg05QE7fzm1-1Jrf9Px_seme55n1DyMrU4jjEKBzB2GFeNpNALDJzjIID31LopmCxmcd5AeqomaSRShMq6gRiEvud-tHwZqq5cG_PhUlc0Uv29QDFpKWoTs",
});
console.log(avs.start());
