# -------------------
# Build stage (compile app)
# -------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr libtesseract-dev libleptonica-dev hunspell hunspell-en-us \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

COPY i2t-Api/tessdata /app/tessdata
COPY i2t-Api/Dictionaries /app/Dictionaries
ENV TESSDATA_PREFIX=/app/tessdata

# ensure libleptonica + libtesseract probe names exist and show dependency checks
RUN mkdir -p /app/x64 /app/x86 \
 && REAL_LEPT=$(find /usr/lib /usr/local/lib -maxdepth 2 -name "liblept.so*" | head -n1) \
 && REAL_TESS=$(find /usr/lib /usr/local/lib -maxdepth 2 -name "libtesseract.so*" | head -n1) \
 && echo "Using LEPT=$REAL_LEPT" \
 && echo "Using TESS=$REAL_TESS" \
 && cp -f "$REAL_LEPT" /app/libleptonica-1.82.0.so \
 && cp -f "$REAL_LEPT" /app/x64/libleptonica-1.82.0.so \
 && cp -f "$REAL_LEPT" /app/x86/libleptonica-1.82.0.so \
 && cp -f "$REAL_TESS" /app/libtesseract50.so \
 && cp -f "$REAL_TESS" /app/x64/libtesseract50.so \
 && cp -f "$REAL_TESS" /app/x86/libtesseract50.so \
 && chmod 755 /app/*.so /app/x64/*.so /app/x86/*.so \
 && ln -s /lib/x86_64-linux-gnu/libdl.so.2 /usr/lib/x86_64-linux-gnu/libdl.so || true \
 #&& echo "ldd on libtesseract50.so:" \
 && ldd /app/x64/libtesseract50.so || true \
 #&& echo "ldd on libleptonica:" \
 && ldd /app/x64/libleptonica-1.82.0.so || true \
 && ls -l /app /app/x64 /app/x86


ENV LD_LIBRARY_PATH=/app:/app/x64:$LD_LIBRARY_PATH

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
