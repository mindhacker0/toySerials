//最大公共子序列
function LCS(str1,str2){
    let len1 = str1.length,len2 = str2.length;
    let dp = [];//dp[i][j]表示以str1[i]结尾,str2[j]结尾的最长公共子序列
    for(let i=0;i<len1;i++){
        dp[i] = [];
        for(let j=0;j<len2;j++){
            if(str1[i]===str2[j]) console.log(str1[i]);
            if(i===0 && j===0) dp[i][j] = str1[i]===str2[i]?str1[i]:"";
            else if(i===0){
                if(str1[i] === str2[j]) dp[i][j] = str1[i];
                else dp[i][j] = dp[i][j-1];
            }else if(j===0){
                if(str1[i] === str2[j]) dp[i][j] = str1[i];
                else dp[i][j] = dp[i-1][j];
            }else{
                if(str1[i] === str2[j]){ dp[i][j] = dp[i-1][j-1]+str1[i];}
                else dp[i][j] = dp[i-1][j].length>dp[i][j-1].length?dp[i-1][j]:dp[i][j-1];
            }
        }
    }
    console.log(dp);
    return dp[len1-1][len2-1];
}
console.log(LCS("abcde","ace" ));
// console.log(LCS("gaafggsagsg","gadsfdsffsdf"));